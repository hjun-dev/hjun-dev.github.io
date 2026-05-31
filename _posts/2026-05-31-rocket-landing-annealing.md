---

layout: post
title: "[Paper Review] Rocket Landing Control with Random Annealing Jump Start Reinforcement Learning"
description: "기존 baseline controller를 guide policy로 활용하여 sparse reward 기반 로켓 착륙 제어를 학습하는 RAJS 방법 리뷰"
date: 2026-03-17 13:00:00 +0900
tags: [rocket landing, reinforcement learning, jump start, PPO, aerospace control]
categories: [control, reinforcement learning, paper review]
related_posts: True
giscus_comments: true
pretty_table: true
pseudocode: true
toc:
sidebar: left
-------------

## Introduction

<br>

이번 포스트에서는 **Rocket Landing Control with Random Annealing Jump Start Reinforcement Learning** 논문을 리뷰한다. 이 논문은 재사용 로켓의 수직 착륙 제어 문제에 강화학습을 적용한 연구이다. <br>

로켓 착륙 제어는 비선형적이고 underactuated한 로켓을 제한된 연료 안에서 실시간으로 제어해야 하는 문제이다. 또한 착륙 순간 위치, 속도, 자세, 각속도 등의 terminal constraint를 만족해야 하므로 일반적인 강화학습으로는 학습이 어렵다. <br>

논문에서 제안하는 방법은 **Random Annealing Jump Start (RAJS)**이다. RAJS는 기존 baseline controller를 **guide policy**로 사용하여 강화학습의 탐색을 돕는다. 에피소드 초반에는 guide policy가 환경을 진행하고, 이후부터는 학습 중인 RL policy가 제어를 이어받는다. 학습이 진행될수록 guide policy가 담당하는 구간을 점점 줄여, 최종적으로는 RL policy가 전체 착륙 과정을 직접 수행하도록 만든다. <br>

논문의 핵심 아이디어는 다음과 같다.

* 로켓 착륙 제어를 sparse reward 기반 goal-oriented task로 정의함
* 기존 baseline controller를 guide policy로 활용함
* guide horizon을 random하게 sampling하고 점진적으로 annealing함
* PPO와 RAJS를 결합하여 PPO-RAJS를 구성함
* Cascading jump start와 action smoothness regulation을 통해 성능과 실용성을 개선함
* 고충실도 Simulink 로켓 모델과 Hardware-in-the-Loop test로 방법을 검증함

---

## 1. Problem Setting: Rocket Landing Control

<br>

논문에서 다루는 문제는 재사용 로켓의 최종 착륙 단계이다. 구체적으로는 lower atmospheric layer에서 로켓을 수직 착륙시키는 제어 문제를 다룬다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/rajs_rocket_landing_task.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Brief task demonstration of rocket landing control.<br>
    (from Jiang et al., Rocket Landing Control with Random Annealing Jump Start Reinforcement Learning)
</div>
<br>

로켓 착륙 제어 문제는 다음과 같은 특징을 가진다.

* 고충실도 로켓 모델을 사용함
* 관성, 엔진, actuator, 공력, 외란 모델이 포함됨
* 다양한 초기 조건에서 착륙해야 함
* 풍속과 풍향 외란이 존재함
* 외란은 controller가 직접 관측하지 못함
* 착륙 순간 여러 terminal constraint를 만족해야 함
* 실시간 제어가 가능해야 함

<br>

논문에서 사용한 로켓 plant는 LandSpace에서 제공한 고충실도 Simulink 모델이다. 이 모델에는 inertia, engine, actuator, aerodynamics, disturbance 등이 포함되어 있다. <br>

좌표계는 지면을 원점으로 두며, $y$축은 수직 위쪽 방향, $x$축은 북쪽, $z$축은 동쪽을 향한다. 로켓의 목표는 다양한 초기 상태에서 시작하여 지면의 목표 착륙점 근처로 안정적으로 착륙하는 것이다.

---

## 2. State, Action, and Terminal Constraints

<br>

로켓 착륙 문제에서 주요 상태는 다음과 같다.

| State                                  | Unit  | Meaning          |
| -------------------------------------- | ----- | ---------------- |
| $x, y, z$                              | m     | position         |
| $v_x, v_y, v_z$                        | m/s   | velocity         |
| $\phi, \psi, \gamma$                   | deg   | angular position |
| $\dot{\phi}, \dot{\psi}, \dot{\gamma}$ | deg/s | angular velocity |
| $m$                                    | kg    | total mass       |

<br>

착륙 성공을 위해서는 위치뿐만 아니라 속도, 자세, 각속도 조건까지 만족해야 한다. 예를 들어 $x,z$ 위치는 목표점 기준 $\pm 5m$ 이내에 있어야 하며, 수평 속도 $v_x, v_z$는 $\pm 1m/s$ 이내에 들어와야 한다. 수직 속도 $v_y$는 $-1 \sim 0m/s$ 범위로 제한된다. <br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/rajs_state_terminal_constraints.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Main states, initial values, and terminal constraints for the rocket landing task.<br>
    (from Jiang et al., Rocket Landing Control with Random Annealing Jump Start Reinforcement Learning)
</div>
<br>

Control input은 총 네 개이다.

* 세 개의 engine attitude signal
* 하나의 engine thrust signal

각 action은 $[-1,1]$ 범위로 normalize된다. <br>

이 문제는 단순히 착륙 지점까지 가는 문제가 아니다. 목표 위치에 도달하더라도 착륙 속도가 너무 크거나, 자세가 불안정하거나, 각속도가 크면 실패로 처리된다. 따라서 policy는 착륙 지점으로 이동하는 동시에 착륙 순간의 전체 상태를 정밀하게 맞춰야 한다.

---

## 3. Goal-Oriented MDP

<br>

논문에서는 로켓 착륙 문제를 **goal-oriented Markov Decision Process**로 정의한다. <br>

일반적인 강화학습 문제에서 agent는 누적 보상을 최대화하는 policy를 학습한다.

$$
\max_{\pi}
\mathbb{E}*{\tau \sim \pi}
\left[
\sum*{t=0}^{T}
\gamma^t r(s_t)
\right]
$$

Goal-oriented task에서는 특정 goal set $S_{goal}$에 도달하는 것이 목표가 된다. 이에 따라 reward는 다음과 같이 정의할 수 있다.

$$
r(s_t)
======

\begin{cases}
1, & s_t \in S_{goal} \
0, & s_t \notin S_{goal}
\end{cases}
$$

<br>

여기서 $S_{goal}$은 terminal constraint를 만족하는 상태 집합이다. 반대로 실패 상태 집합 $S_{fail}$도 존재한다. 에피소드는 성공적으로 착륙하거나, 실패 상태에 도달하거나, 연료가 소진되거나, 수직 속도가 반전되는 경우 종료된다. <br>

이 문제의 어려움은 보상이 매우 sparse하다는 데 있다. 대부분의 trajectory는 terminal constraint를 만족하지 못하므로 보상 0을 받는다. 그러면 PPO와 같은 일반적인 강화학습 알고리즘은 어떤 행동이 더 나은지 판단하기 어렵다.

---

## 4. Baseline Controller

<br>

논문에서는 Simulink plant 내부에 baseline controller가 포함되어 있다. 이 controller는 여러 reference trajectory와 PID control mechanism을 기반으로 한다. <br>

Baseline controller는 정상 조건에서는 자세 안정화와 수직 하강을 어느 정도 수행할 수 있다. 하지만 다양한 초기 조건과 외란이 존재할 때는 terminal constraint를 자주 위반한다. 논문에서 baseline controller의 성공률은 약 8%로 보고된다. <br>

즉, baseline controller는 완전한 해결책은 아니지만 유용한 정보를 포함하고 있다.

* 로켓을 어느 정도 착륙 방향으로 유도할 수 있음
* 완전한 random policy보다 좋은 trajectory를 생성함
* 초기 학습 단계에서 RL policy의 탐색공간을 줄여줄 수 있음
* 기존 제어 지식을 guide policy 형태로 활용할 수 있음

<br>

RAJS는 이 baseline controller를 단순히 imitation하는 것이 아니라, RL policy의 학습을 돕는 guide policy로 사용한다.

---

## 5. Proximal Policy Optimization

<br>

논문에서는 RL 알고리즘으로 **Proximal Policy Optimization (PPO)**를 사용한다. PPO는 on-policy policy gradient 기반 알고리즘이며, 연속 제어 문제에서 자주 사용된다. <br>

PPO의 핵심 objective는 다음과 같다.

$$
J_{\pi}(\theta)
===============

\frac{1}{|D|}
\sum_{x,u \in D}
\min
\left(
\rho(\theta) A^{\pi_{old}}(x,u),
clip(\rho(\theta), 1-\epsilon, 1+\epsilon) A^{\pi_{old}}(x,u)
\right)
$$

여기서 $\rho(\theta)$는 importance sampling ratio이다.

$$
\rho(\theta)
============

\frac{\pi_{\theta}(u|x)}
{\pi_{old}(u|x)}
$$

<br>

PPO는 policy가 한 번에 너무 크게 업데이트되는 것을 막기 위해 clipping을 사용한다. 이를 통해 학습 안정성을 높인다. <br>

하지만 PPO를 로켓 착륙 문제에 그대로 적용하기는 어렵다. 앞서 설명한 것처럼 이 문제는 sparse reward 기반 goal-oriented task이기 때문이다. Random policy가 성공 착륙 상태에 도달할 확률이 매우 낮기 때문에, PPO만으로는 충분한 학습 신호를 얻기 어렵다. <br>

따라서 논문에서는 PPO를 RAJS와 결합하여 사용한다.

---

## 6. Jump Start Framework

<br>

Jump Start framework는 guide policy와 exploration policy를 함께 사용하는 구조이다.

* $\pi_g$: fixed guide policy
* $\pi_e$: learnable exploration policy

각 episode에서 guide policy가 먼저 $H$ step 동안 환경을 진행한다. 이후 exploration policy가 나머지 step을 제어한다.

$$
\pi =
\begin{cases}
\pi_g, & t < H \
\pi_e, & t \ge H
\end{cases}
$$

<br>

이 구조의 직관은 간단하다. 처음부터 RL policy가 전체 착륙 과정을 학습하려고 하면 탐색공간이 너무 크다. 하지만 guide policy가 어느 정도 적절한 상태까지 환경을 진행시켜주면, RL policy는 남은 구간부터 학습할 수 있다. <br>

로켓 착륙 문제에서는 baseline controller가 guide policy 역할을 한다. Baseline controller가 에피소드 초반을 담당하고, 이후 PPO policy가 이어받아 착륙을 시도한다.

---

## 7. Limitation of Existing JSRL

<br>

기존 Jump Start Reinforcement Learning에는 대표적으로 두 가지 방식이 있다.

1. **JSRL-Curriculum**
2. **JSRL-Random**

---

### 7.1 JSRL-Curriculum

<br>

JSRL-Curriculum은 guide horizon을 curriculum stage에 따라 점점 줄이는 방식이다.

$$
H_k
===

\left(
1 - \frac{k}{n}
\right)
\bar{H}
$$

여기서 $\bar{H}$는 초기 guide horizon이고, $n$은 curriculum stage 수이다. <br>

이 방식은 학습이 진행될수록 guide policy의 도움을 줄이고, 최종적으로는 RL policy가 전체 episode를 직접 수행하도록 만든다. 하지만 guide horizon이 stage 단위로 바뀌기 때문에, 각 stage 전환 시점에서 initial state distribution이 갑자기 달라진다. <br>

이러한 변화는 **distribution shift**를 발생시킨다. 특히 PPO와 같은 on-policy 알고리즘은 현재 policy로 수집한 데이터에 민감하므로, 상태분포가 갑자기 바뀌면 학습이 불안정해질 수 있다.

---

### 7.2 JSRL-Random

<br>

JSRL-Random은 guide horizon을 uniform distribution에서 random하게 sample한다.

$$
H \sim U(0,\bar{H})
$$

이 방식은 guide horizon이 매 episode마다 random하게 정해지기 때문에 JSRL-Curriculum보다 학습 중 distribution shift가 작다. <br>

하지만 JSRL-Random에는 **distribution mismatch** 문제가 있다. 학습 중에는 guide policy가 항상 일정 확률로 episode 초반을 진행한다. 반면 실제 evaluation에서는 RL policy가 처음부터 전체 episode를 제어해야 한다. 따라서 학습 중 exploration policy가 경험한 상태분포와 최종 evaluation 상태분포가 달라질 수 있다. <br>

정리하면 다음과 같다.

| Method          | Main Issue                            |
| --------------- | ------------------------------------- |
| JSRL-Curriculum | stage 전환 시 distribution shift         |
| JSRL-Random     | 최종 evaluation과의 distribution mismatch |

<br>

논문에서 제안하는 RAJS는 이 두 문제를 완화하기 위해 guide horizon을 random하게 sample하면서, 그 upper bound를 점진적으로 줄이는 방식을 사용한다.

---

## 8. Random Annealing Jump Start

<br>

**Random Annealing Jump Start (RAJS)**는 guide horizon을 다음과 같이 설정한다.

$$
H \sim U(0, \bar{H}\beta(\cdot))
$$

여기서 $\bar{H}$는 maximum guide horizon이고, $\beta(\cdot)$는 annealing factor이다. $\beta$는 1에서 시작하여 학습이 진행될수록 0으로 감소한다. <br>

초기에는 $\beta=1$이므로 guide horizon은 $U(0,\bar{H})$에서 sampling된다. 따라서 guide policy가 에피소드 초반을 도와준다. 학습이 진행되면 $\beta$가 감소하고, guide policy가 담당하는 구간이 점점 짧아진다. 최종적으로 $\beta=0$이 되면 $H=0$이므로 RL policy가 처음부터 전체 episode를 담당한다. <br>

RAJS의 구조는 다음과 같이 이해할 수 있다.

1. 초기에는 guide policy가 탐색을 도와줌
2. RL policy는 상대적으로 쉬운 후반부 제어부터 학습함
3. 학습이 진행될수록 guide horizon을 줄임
4. RL policy가 점점 더 앞부분부터 제어하게 됨
5. 최종적으로 RL policy가 전체 착륙 과정을 직접 수행함

<br>

RAJS의 annealing update는 다음과 같다.

$$
\beta
\leftarrow
\max
\left(
\beta - \alpha I(P_{goal} \ge P_{thresh}),
0
\right)
$$

여기서 $P_{goal}$은 moving average success rate이고, $P_{thresh}$는 annealing을 진행할 기준 성공률이다. 즉, policy가 일정 수준 이상의 성공률을 보이면 guide policy의 도움을 조금 줄인다.

---

## 9. RAJS Algorithm

<br>

논문에서 제안하는 RAJS with on-policy RL의 전체 흐름은 다음과 같다.

```text
Algorithm: Random Annealing Jump Start with On-Policy RL

Input:
    guide policy π_g
    maximum guide horizon H_bar
    metric threshold P_thresh
    annealing step size α
    training batch size B

Initialize:
    exploration policy π_e
    value function V
    annealing factor β ← 1
    moving mean metric P ← 0

Repeat:
    1. Initialize trajectory dataset D
    2. Sample initial state s_0 from d_init
    3. Sample guide horizon H ~ U(0, H_bar β)
    4. Rollout floor(H) steps with guide policy π_g
    5. Rollout until termination with exploration policy π_e
    6. Store trajectory data in D
    7. Train π_e and V using on-policy RL
    8. Update β ← max(β - α I(P ≥ P_thresh), 0)

Until:
    β = 0 and convergence
```

<br>

이 알고리즘에서 중요한 부분은 guide horizon이 고정되어 있지 않다는 것이다. 매 episode마다 random하게 guide horizon을 sample하며, 그 sampling range의 upper bound가 학습에 따라 줄어든다. <br>

따라서 RAJS는 JSRL-Random처럼 안정적인 sampling을 유지하면서도, 최종적으로는 원래 initial state distribution에서 RL policy가 학습되도록 만든다.

---

## 10. Cascading Jump Start

<br>

논문에서는 추가적으로 **Cascading Jump Start**를 사용한다. <br>

Baseline controller의 성공률은 8%로 낮다. 따라서 baseline controller를 guide policy로 사용하는 것만으로는 충분하지 않을 수 있다. 이때 먼저 기본 setting에서 PPO-RAJS policy를 학습하고, 이후 학습된 policy를 새로운 guide policy로 사용한다. <br>

구조는 다음과 같다.

$$
\pi_g^{(0)}
===========

\text{baseline controller}
$$

$$
\pi_g^{(1)}
===========

\pi_{\text{PPO-RAJS}}
$$

<br>

이후 더 어려운 setting에서 새로운 exploration policy를 학습한다. 논문에서는 action smoothness regulation을 추가한 PPO-RAJS-S policy를 학습할 때 cascading jump start를 사용한다. <br>

즉, 처음에는 baseline controller를 이용해 기본적인 착륙 policy를 얻고, 그 다음에는 학습된 policy를 guide로 사용해 더 부드러운 제어 입력을 생성하는 policy를 학습한다.

---

## 11. Reward Design

<br>

로켓 착륙 문제의 본질적인 목표는 terminal constraint를 만족하는 것이다. 따라서 가장 직접적인 reward는 성공하면 1, 실패하면 0을 주는 binary terminal reward이다. <br>

하지만 이러한 reward만 사용하면 학습이 어렵다. 성공하지 못한 trajectory들은 모두 같은 보상 0을 받기 때문에, 어떤 실패가 goal에 더 가까운 실패였는지 구분하기 어렵다. <br>

논문에서는 reward 설계를 위해 다음 원칙을 사용한다.

1. **Intermediate reward는 0으로 둔다.**

   * 중간 보상이 잘못 설계되면 policy가 원래 task와 다른 방향으로 학습될 수 있다.

2. **Terminal reward는 non-negative로 둔다.**

   * negative terminal reward가 쉽게 발생하면 policy가 종료를 피하려고 할 수 있다.

3. **Goal 근처의 terminal state에는 smooth reward를 제공한다.**

   * 완전한 성공은 아니더라도 goal에 가까운 착륙 상태는 더 높은 reward를 받도록 한다.

<br>

이를 위해 논문에서는 $S_{goal}$을 포함하는 근방 집합 $S_{prox}$를 정의한다. 로켓 착륙에서는 $S_{prox}$를 모든 landing state, 즉 $y=0$인 상태로 설정할 수 있다. <br>

Terminal reward는 다음과 같이 정의된다.

$$
r_T
===

\begin{cases}
r_{prox}, & s_T \in S_{prox} \
0, & s_T \notin S_{prox}
\end{cases}
$$

그리고 $r_{prox}$는 다음과 같다.

$$
r_{prox}
========

\max
\left(
b - \log(1 + p \max e),
0
\right)
$$

여기서 $e$는 normalized terminal error이다.

$$
e
=

\left|
\frac{s_T - s_{target}}
{s_{range}}
\right|
$$

<br>

이 reward는 착륙 상태가 목표 terminal constraint에 가까울수록 더 큰 값을 가진다. 이를 통해 sparse reward 문제를 완화하면서도, intermediate reward를 사용하지 않는 goal-oriented formulation을 유지한다.

---

## 12. Terminal Condition

<br>

논문에서는 기본 terminal condition 외에도 추가적인 early termination condition을 사용한다. <br>

로켓 착륙에서 수직 속도 $v_y$ 제어는 매우 중요하다. 착륙 시점에서 $v_y$는 $-1 \sim 0m/s$ 범위에 들어와야 한다. 하지만 고도 $y$와 수직 속도 $v_y$는 강하게 coupling되어 있기 때문에, 너무 낮은 고도에서 수직 속도가 크면 더 이상 안정적인 착륙이 불가능하다. <br>

논문에서는 이러한 경우를 조기에 판단하기 위해 최소 필요 고도 $y_{min}$을 계산한다.

$$
y_{min}
=======

\begin{cases}
\frac{v_y^2 - v_{sw}^2}{2a_{max,1}}
+
\frac{v_{sw}^2}{2a_{max,2}},
& v_y \le v_{sw}
\
\frac{v_y^2}{2a_{max,2}},
& v_{sw} < v_y < 0
\end{cases}
$$

여기서 $v_{sw}$는 stage switch threshold이고, $a_{max,1}$, $a_{max,2}$는 각 stage에서 가능한 approximate maximum deceleration이다. <br>

만약 현재 고도 $y$가 $y_{min}$보다 작거나 같다면, 최대 감속을 하더라도 proper landing이 불가능하다고 판단하고 episode를 종료한다. 이 경우 terminal reward는 0이다. <br>

이 early termination은 불필요하게 긴 실패 trajectory를 줄이고, 학습 중 credit assignment를 돕는다.

---

## 13. Action Smoothness Regulation

<br>

실제 plant에서는 actuator delay와 transient response가 존재한다. 따라서 제어 입력이 지나치게 빠르게 진동하면 실제 actuator 구현에서 문제가 발생할 수 있다. <br>

논문에서는 action smoothness를 개선하기 위해 두 가지 방법을 사용한다.

첫 번째는 policy가 action 자체를 직접 출력하는 대신, action increment를 출력하도록 만드는 것이다.

$$
\tilde{s}
=========

\begin{bmatrix}
s \
a
\end{bmatrix}
$$

$$
\tilde{a}
=========

\Delta a
$$

$$
a'
==

clip(a + k\Delta a, -1, 1)
$$

여기서 $k$는 scaling factor이다. 이 구조에서는 policy가 현재 action에서 얼마나 바꿀지를 출력하므로 action 변화가 자연스럽게 제한된다. <br>

두 번째는 PPO policy loss에 action increment penalty를 추가하는 것이다.

$$
\tilde{J}_{\pi}(\theta)
=======================

J_{\pi}(\theta)
+
\epsilon
\sum
|\tilde{a}|^2
$$

여기서 $\epsilon$은 작은 positive coefficient이다. <br>

논문에서는 이러한 smoothness regulation을 바로 적용하지 않고, 먼저 PPO-RAJS를 학습한 뒤 그 policy를 guide policy로 사용하여 PPO-RAJS-S를 학습한다. 이를 통해 action smoothness라는 추가 조건이 있어도 안정적으로 학습할 수 있게 한다.

---

## 14. Environment Implementation

<br>

논문에서는 Simulink로 모델링된 high-fidelity rocket plant를 RL 환경으로 감싼다. RL 학습은 많은 환경 interaction을 요구하기 때문에, Simulink interpreted execution을 그대로 사용하는 것은 비효율적이다. <br>

이를 해결하기 위해 저자들은 Simulink Embedded Coder를 사용하여 C code를 생성하고, 이를 native module로 compile한다. 또한 GOPS Slxpy를 사용하여 RL 환경과 연결한다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/rajs_wrapped_plant.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Wrapped plant for reinforcement learning training.<br>
    (from Jiang et al., Rocket Landing Control with Random Annealing Jump Start Reinforcement Learning)
</div>
<br>

이 구조에서 plant는 두 종류의 action을 받을 수 있다.

* external action from RL policy
* baseline action from guidance and control system

<br>

RAJS에서는 guide horizon 동안 baseline action을 사용하고, 이후에는 RL policy의 external action을 사용한다. 따라서 기존 Simulink controller와 RL policy를 하나의 training environment 안에서 함께 사용할 수 있다.

---

## 15. Benchmark Experiment

<br>

논문에서는 PPO-RAJS를 여러 baseline과 비교한다.

| Algorithm | Description                                    |
| --------- | ---------------------------------------------- |
| PPO       | Sparse reward 환경을 PPO로 직접 학습                   |
| PPO-Track | Baseline controller trajectory를 tracking하도록 학습 |
| PPO-JSRL  | JSRL-Random과 PPO를 결합                           |
| PPO-RAJS  | Random Annealing Jump Start와 PPO를 결합           |

<br>

공통 hyperparameter는 다음과 같다.

| Parameter                 | Value              |
| ------------------------- | ------------------ |
| Learning rate             | $3 \times 10^{-4}$ |
| Network size              | $(256, 256)$       |
| Network activation        | tanh               |
| Discount factor $\gamma$  | 0.995              |
| GAE $\lambda$             | 0.97               |
| Train batch size          | 20,000             |
| Gradient steps            | 30                 |
| Clip parameter $\epsilon$ | 0.2                |
| Target KL divergence      | 0.01               |
| Entropy coefficient       | 0.007              |

<br>

PPO-RAJS의 주요 hyperparameter는 다음과 같다.

| Parameter                           | Value    |
| ----------------------------------- | -------- |
| Maximum guide horizon $\bar{H}$     | 18       |
| Success rate threshold $P_{thresh}$ | 0.3      |
| Annealing step size $\alpha$        | $1/1500$ |

<br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/rajs_success_rate_baselines.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Success rate for PPO-RAJS and baselines.<br>
    (from Jiang et al., Rocket Landing Control with Random Annealing Jump Start Reinforcement Learning)
</div>
<br>

결과를 보면 PPO는 sparse reward로 인해 거의 학습하지 못한다. PPO-Track은 predefined trajectory를 tracking하도록 reward를 구성했지만, 다양한 초기 조건과 외란에 충분히 적응하지 못한다. <br>

PPO-JSRL은 초반에는 성능이 증가하지만, 이후 distribution mismatch로 인해 성능 향상이 제한된다. 반면 PPO-RAJS는 높은 성공률로 수렴하며 seed 간 variance도 작게 나타난다.

---

## 16. PPO-RAJS-S and Smoothness Result

<br>

논문에서는 PPO-RAJS로 학습한 policy를 새로운 guide policy로 사용하여 PPO-RAJS-S를 학습한다. PPO-RAJS-S는 action smoothness regulation이 추가된 policy이다. <br>

Action smoothness를 정량화하기 위해 논문에서는 second-order fluctuation $F_2$를 정의한다.

$$
F_2
===

\frac{1}{T-2}
\sum_{t=2}^{T-1}
|a_t + a_{t-2} - 2a_{t-1}|
$$

$F_2$가 작을수록 action sequence가 더 부드럽다고 볼 수 있다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/rajs_smooth_training_curve.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Training curve comparison between PPO-RAJS and PPO-RAJS-Smooth.<br>
    (from Jiang et al., Rocket Landing Control with Random Annealing Jump Start Reinforcement Learning)
</div>
<br>

위 결과에서 PPO-RAJS-S는 PPO-RAJS보다 더 빠르게 성공률이 증가하며, action fluctuation도 크게 감소한다. 이는 cascading jump start를 사용하여 smoothness regulation이 포함된 setting에서도 안정적으로 policy를 학습할 수 있었기 때문이다. <br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/rajs_action_sequence_comparison.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Action sequence comparison between PPO-RAJS and PPO-RAJS-S.<br>
    (from Jiang et al., Rocket Landing Control with Random Annealing Jump Start Reinforcement Learning)
</div>
<br>

같은 초기 조건에서 PPO-RAJS와 PPO-RAJS-S의 action sequence를 비교하면, PPO-RAJS-S의 제어 입력이 훨씬 부드럽게 변화하는 것을 볼 수 있다.

---

## 17. Final Evaluation

<br>

논문에서는 최종 PPO-RAJS-S policy를 $10^6$개의 서로 다른 initial condition에서 평가한다. 최종 성능은 다음과 같다.

| Metric                  | Value  |
| ----------------------- | ------ |
| Success rate            | 0.9739 |
| Landing rate            | 0.9953 |
| Vertical speed reversal | 0.0043 |
| Fuel exhaustion         | 0.0003 |

<br>

Landing trial 중 각 constraint의 satisfaction rate는 대부분 99% 이상이다. 다만 $v_y$ constraint는 다른 항목보다 상대적으로 위반 빈도가 높게 나타난다. 이는 로켓 착륙에서 수직 속도 제어가 특히 어려운 요소임을 보여준다. <br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/rajs_final_policy_statistics.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Final policy evaluation statistics of PPO-RAJS-S.<br>
    (from Jiang et al., Rocket Landing Control with Random Annealing Jump Start Reinforcement Learning)
</div>
<br>

또한 논문에서는 PPO-RAJS-S policy가 제어한 100개의 trajectory를 시각화한다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/rajs_landing_trajectories.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    A subset of 100 trajectories controlled by the PPO-RAJS-S policy.<br>
    (from Jiang et al., Rocket Landing Control with Random Annealing Jump Start Reinforcement Learning)
</div>
<br>

대부분의 trajectory가 목표 착륙 지점 근처로 수렴하는 것을 볼 수 있다.

---

## 18. Hardware-in-the-Loop Test

<br>

논문에서는 학습된 policy를 ZU9E embedded platform에 배포하고, rocket dynamics simulation engine과 Hardware-in-the-Loop co-simulation을 수행한다. <br>

실험 결과, policy inference가 10 ms control interval 안에서 수행되는 것을 확인했다. 이는 PPO-RAJS-S controller가 실시간 제어 관점에서도 적용 가능한 계산 속도를 가진다는 것을 보여준다. <br>

즉, 논문은 단순히 학습 성공률만 제시한 것이 아니라, 제어 입력의 smoothness와 실시간 inference 가능성도 함께 확인하였다.

---

## 19. Takeaways

<br>

이 논문의 핵심 정리는 다음과 같다.

1. **로켓 착륙 제어는 sparse reward 기반 goal-oriented task이다.**

   * Terminal constraint를 만족해야만 성공하므로 일반적인 PPO만으로는 학습이 어렵다.

2. **기존 baseline controller를 guide policy로 활용한다.**

   * Baseline controller의 성공률은 낮지만, RL exploration을 돕는 데 사용할 수 있다.

3. **RAJS는 random guide horizon과 annealing을 결합한다.**

   * Guide horizon을 $U(0,\bar{H}\beta)$에서 sampling하고, $\beta$를 점진적으로 줄인다.

4. **RAJS는 distribution shift와 mismatch 문제를 완화한다.**

   * JSRL-Curriculum의 급격한 distribution shift와 JSRL-Random의 evaluation mismatch를 줄이는 방향이다.

5. **Cascading jump start를 통해 더 어려운 setting으로 확장한다.**

   * 먼저 PPO-RAJS를 학습한 뒤, 이를 guide로 사용해 smoothness regulation이 포함된 PPO-RAJS-S를 학습한다.

6. **PPO-RAJS-S는 높은 성공률과 부드러운 제어 입력을 보인다.**

   * 최종 성공률은 97.39%이며, action fluctuation도 감소한다.

7. **Hardware-in-the-Loop test를 통해 실시간 적용 가능성을 확인한다.**

   * Embedded platform에서 10 ms control interval 안에 inference가 수행된다.

---

## Conclusion

<br>

이 논문은 로켓 착륙 제어와 같이 sparse reward를 가지는 goal-oriented task에서 기존 baseline controller를 활용하는 **Random Annealing Jump Start (RAJS)** 방법을 제안한다. <br>

RAJS는 에피소드 초반에는 guide policy가 환경을 진행하고, 이후 exploration policy가 남은 구간을 제어하도록 만든다. 학습이 진행될수록 guide horizon의 upper bound를 줄여 최종적으로는 RL policy가 전체 착륙 과정을 직접 수행하도록 한다. <br>

실험 결과, baseline controller의 성공률은 8%였지만 PPO-RAJS-S는 97.39%의 성공률을 달성했다. 또한 action smoothness regulation을 통해 더 부드러운 제어 입력을 생성했으며, Hardware-in-the-Loop test를 통해 실시간 제어 가능성도 확인했다. <br>

따라서 이 논문은 기존 제어기를 단순히 대체하는 것이 아니라, 기존 제어기를 guide로 활용하여 어려운 로켓 착륙 제어 문제를 강화학습으로 학습하는 방법을 보여준다.
