---
layout: post
title: "[Paper Review] Real-world Reinforcement Learning from Suboptimal Interventions"
description: "불완전한 인간 개입 데이터를 state-wise Lagrangian constraint로 활용하는 실세계 로봇 조작 강화학습 방법 SiLRI 리뷰"
date: 2026-05-31 13:00:00 +0900
tags: [human-in-the-loop, reinforcement learning, robot manipulation, intervention, constrained RL]
categories: [reinforcement learning, paper review]
related_posts: True
giscus_comments: true
pretty_table: true
pseudocode: true
toc:
  sidebar: left
---

## Introduction

<br>

이번 포스트에서는 **Real-world Reinforcement Learning from Suboptimal Interventions** 논문을 리뷰한다. 이 논문은 실세계 로봇 조작 문제에서 인간 개입 데이터를 활용하여 강화학습을 더 효율적으로 수행하는 방법을 다룬다. <br>

기존 Human-in-the-loop Reinforcement Learning(HIL-RL) 방법들은 인간이 개입한 데이터를 학습에 사용한다. 하지만 많은 방법들이 인간 개입을 거의 최적 행동처럼 취급한다. 실제로는 숙련된 작업자라도 모든 상태에서 항상 최적의 행동을 제공하지는 못하며, 특히 정밀 조작이나 장기 작업에서는 개입 행동에 불확실성과 실수가 포함될 수 있다. <br>

이 논문에서 제안하는 방법은 **SiLRI**이다. SiLRI는 **State-wise Lagrangian Reinforcement learning from suboptimal Interventions**의 약자이다. 핵심 아이디어는 인간 개입의 신뢰도가 상태마다 다르다는 점을 이용하는 것이다. 인간이 일관된 개입을 제공하는 상태에서는 imitation을 강하게 사용하고, 인간 개입이 불확실한 상태에서는 RL objective가 더 큰 역할을 하도록 만든다. <br>

논문의 핵심 아이디어는 다음과 같다.

- 실세계 로봇 조작 문제에서 인간 개입 데이터를 사용함
- 인간 개입이 항상 최적이라고 가정하지 않음
- 인간 행동의 state-wise uncertainty를 추정함
- uncertainty가 낮은 상태에서는 behavior cloning을 강하게 적용함
- uncertainty가 높은 상태에서는 RL objective를 더 크게 반영함
- 이를 위해 state-wise Lagrange multiplier를 학습함
- 실제 로봇 조작 8개 task에서 SiLRI를 검증함

---

## 1. Motivation: Suboptimal Human Interventions

<br>

실세계 로봇 조작에서는 강화학습을 완전히 autonomous하게 수행하기 어렵다. 로봇이 직접 탐색하면서 실패를 반복하면 안전 문제가 발생할 수 있고, sparse reward 환경에서는 sample efficiency도 낮다. 따라서 최근에는 사람이 중간중간 개입하여 로봇의 실패를 막고, 개입 데이터를 학습에 사용하는 **Human-in-the-loop RL**이 많이 사용된다. <br>

하지만 여기에는 중요한 문제가 있다. 인간 개입 데이터가 항상 최적 행동은 아니라는 점이다. 특히 다음과 같은 상황에서는 인간 행동의 불확실성이 커질 수 있다.

- 정밀한 위치 조정이 필요한 상태
- 작은 구멍에 삽입해야 하는 상태
- deformable object를 다루는 상태
- 장기 horizon에서 여러 단계를 거쳐야 하는 상태
- teleoperation system의 조작감이 어려운 상태

<br>

논문에서는 인간 demonstration trajectory에서 상태별 행동 entropy를 분석한다. Low-entropy state에서는 사람이 비슷한 상태에서 일관된 행동을 제공하지만, high-entropy state에서는 사람의 행동이 불안정하고 일관되지 않게 나타난다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/silri_human_intervention_entropy.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Entropy of human interventions across states.<br>
    (from Zhao et al., Real-world Reinforcement Learning from Suboptimal Interventions)
</div>
<br>

위 그림의 핵심은 상태마다 인간 개입의 품질이 다르다는 것이다. 어떤 상태에서는 사람의 행동이 매우 일관적이므로 imitation learning이 효과적이다. 반면 어떤 상태에서는 사람의 행동이 불확실하므로, 해당 행동을 강하게 따라 하는 것이 오히려 최종 성능을 제한할 수 있다. <br>

따라서 이 논문은 다음 질문을 다룬다.

> Suboptimal하고 noisy한 인간 개입 데이터를 어떻게 활용해야 RL 학습을 빠르게 하면서도, 최종 policy가 인간 개입에 의해 제한되지 않도록 만들 수 있을까?

---

## 2. Overall Idea of SiLRI

<br>

SiLRI는 인간 개입 데이터를 단순히 전부 imitation하지 않는다. 대신 상태별로 인간 개입의 uncertainty를 추정하고, 그 uncertainty에 따라 RL objective와 BC objective의 비중을 조절한다. <br>

핵심 구조는 다음과 같다.

- 인간 개입이 일관적인 상태
  - 인간 behavior policy를 신뢰할 수 있음
  - learned policy가 human behavior policy 근처에 머물도록 constraint를 강하게 둠
  - behavior cloning 성분이 강해짐

- 인간 개입이 불확실한 상태
  - 인간 behavior policy를 강하게 따라 하면 오히려 성능이 제한될 수 있음
  - constraint를 완화함
  - RL objective가 더 크게 작동함

<br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/silri_overall_framework.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    SiLRI framework for real-world reinforcement learning from suboptimal interventions.<br>
    (from Zhao et al., Real-world Reinforcement Learning from Suboptimal Interventions)
</div>
<br>

논문에서는 이를 constrained RL 문제로 정식화한다. Learned policy가 human behavior policy에서 너무 멀어지지 않도록 constraint를 두되, 그 constraint bound를 인간 개입의 uncertainty에 따라 state-wise하게 조절한다. <br>

이를 해결하기 위해 state-wise Lagrange multiplier $\lambda(s)$를 학습한다. $\lambda(s)$가 크면 BC objective가 강해지고, $\lambda(s)$가 작으면 RL objective가 더 강해진다.

---

## 3. Human-in-the-loop RL Setting

<br>

논문에서는 로봇 조작 문제를 다음과 같은 MDP로 정의한다.

$$
(S, A, I, \rho, P, R, \gamma)
$$

여기서 각 항의 의미는 다음과 같다.

| Symbol | Meaning |
| --- | --- |
| $S$ | state space |
| $A$ | action space |
| $I$ | intervention indicator |
| $\rho$ | initial-state distribution |
| $P$ | transition dynamics |
| $R$ | reward function |
| $\gamma$ | discount factor |

<br>

State $s$는 여러 RGB image와 robot proprioceptive signal로 구성된다. Action $a$는 desired end-effector 6D movement와 같은 로봇 제어 입력이다. <br>

Intervention indicator $I(s,a)$는 action의 출처를 나타낸다.

$$
I(s,a)
=
\begin{cases}
1, & \text{human intervention} \\
0, & \text{autonomous control}
\end{cases}
$$

<br>

Reward는 sparse reward 형태를 사용한다. Task를 성공하면 reward 10을 받고, 그 외 step에서는 $-0.05$ penalty를 받는다. <br>

기존 방법들은 보통 다음 objective를 최적화한다.

$$
J(\pi)
=
\mathbb{E}_{\tau \sim \pi}
\left[
\sum_{t=0}^{T}
\gamma^t r(s_t,a_t)
\right]
$$

하지만 이 objective만 사용하면 인간 intervention data에 포함된 유용한 정보를 충분히 활용하지 못한다. 반대로 intervention data를 전부 behavior cloning으로 강하게 따라 하면, suboptimal한 인간 행동에 policy가 묶일 수 있다. <br>

따라서 SiLRI는 RL objective와 BC objective 사이의 균형을 state-wise하게 조절한다.

---

## 4. Constrained RL Formulation

<br>

SiLRI는 learned policy $\pi$가 human behavior policy $\beta$에서 너무 멀어지지 않도록 constrained optimization 문제를 정의한다.

$$
\max_{\pi} J(\pi)
$$

$$
\text{s.t.}
\quad
D
\left(
\pi(\cdot|s)
\Vert
\beta(\cdot|s)
\right)
\le \epsilon,
\quad
\forall s
$$

여기서 $\beta$는 인간 intervention data로부터 추정한 behavior policy이다. <br>

하지만 deterministic robot policy $\pi$와 stochastic human behavior policy $\beta$ 사이의 거리를 직접 계산하기 어렵다. 또한 KL divergence를 그대로 사용하면 unbounded 특성 때문에 empirical optimization이 어려울 수 있다. <br>

그래서 논문에서는 constraint를 다음과 같이 바꾼다.

$$
\max_{\pi} J(\pi)
$$

$$
\text{s.t.}
\quad
\left\|
\mu(\pi(\cdot|s))
-
\mu(\beta(\cdot|s))
\right\|
\le
\kappa \cdot \sigma_{\beta}(s),
\quad
\forall s
$$

여기서 $\mu$는 policy의 mean action이고, $\sigma_{\beta}(s)$는 human behavior policy의 standard deviation이다. <br>

이 식의 의미는 다음과 같다.

- $\sigma_{\beta}(s)$가 작다.
  - 인간 행동이 일관적이다.
  - learned policy는 human behavior policy 가까이에 있어야 한다.

- $\sigma_{\beta}(s)$가 크다.
  - 인간 행동이 불확실하다.
  - learned policy가 human behavior policy에서 더 멀어질 수 있다.

<br>

즉, SiLRI는 인간 intervention uncertainty를 constraint bound로 사용한다.

---

## 5. State-wise Lagrange Multiplier

<br>

Constrained optimization 문제를 풀기 위해 논문은 Lagrange multiplier를 도입한다. 중요한 점은 하나의 scalar multiplier가 아니라, 상태마다 다른 값을 가지는 **state-wise Lagrange multiplier** $\lambda(s)$를 사용한다는 것이다. <br>

Lagrangian은 다음과 같이 정의된다.

$$
\mathcal{L}(\pi,\lambda)
=
-J(\pi)
+
\lambda^{\top}
\left[
D(\pi,\beta)
-
\kappa \Sigma_{\beta}
\right]
$$

여기서 $D(\pi,\beta)$는 learned policy와 behavior policy 사이의 action deviation이고, $\Sigma_{\beta}$는 behavior policy의 uncertainty를 의미한다. <br>

Lagrange dual problem은 다음과 같다.

$$
\sup_{\lambda}
\inf_{\pi}
\mathcal{L}(\pi,\lambda),
\quad
\text{s.t.}
\quad
\lambda(\cdot) \ge 0
$$

Policy $\pi$ 입장에서 보면 다음 objective를 최소화한다.

$$
\inf_{\pi}
\left[
-J(\pi)
+
\lambda^{\top}D(\pi,\beta)
\right]
$$

반대로 Lagrange multiplier $\lambda$ 입장에서는 constraint violation을 기준으로 값을 조절한다.

$$
\sup_{\lambda}
\lambda^{\top}
\left[
D(\pi,\beta)
-
\kappa \Sigma_{\beta}
\right],
\quad
\text{s.t.}
\quad
\lambda(\cdot) \ge 0
$$

<br>

직관적으로는 다음과 같다.

```text
Low-entropy state:
human action is consistent
→ constraint is tight
→ λ(s) increases
→ BC term becomes stronger

High-entropy state:
human action is inconsistent
→ constraint is relaxed
→ λ(s) decreases
→ RL term becomes stronger
```

<br>

따라서 $\lambda(s)$는 상태별로 RL과 BC의 균형을 조절하는 weight 역할을 한다.

---

## 6. Network Components

<br>

SiLRI는 네 가지 network를 사용한다.

| Network | Role |
| --- | --- |
| Critic $Q$ | RL value estimation |
| Actor $\pi$ | learned robot policy |
| Behavior policy $\beta$ | human intervention policy approximation |
| Lagrange network $\lambda$ | state-wise constraint weight |

<br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/silri_network_components.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Network components in SiLRI.<br>
    (from Zhao et al., Real-world Reinforcement Learning from Suboptimal Interventions)
</div>
<br>

논문에서는 off-policy RL의 안정성을 위해 target actor network와 double Q-network architecture를 사용한다. 또한 behavior policy $\beta$는 intervention buffer의 데이터를 이용해 별도로 학습된다. <br>

각 network의 역할은 다음과 같다.

- $Q$
  - 현재 policy의 action value를 추정함
  - RL objective를 제공함

- $\pi$
  - 실제 로봇 policy
  - RL objective와 BC objective를 함께 사용하여 학습됨

- $\beta$
  - 인간 intervention data를 이용해 학습된 behavior policy
  - state-wise uncertainty $\sigma_{\beta}(s)$를 제공함

- $\lambda$
  - learned policy와 behavior policy 사이의 constraint violation을 기준으로 state-wise weight를 출력함

---

## 7. Critic Optimization

<br>

Critic network $Q$는 일반적인 Bellman update를 사용하여 학습된다.

$$
\mathcal{L}(\theta^Q)
=
\mathbb{E}_{s,a,s'}
\left[
\left(
r
+
\gamma
\hat{Q}
\left(
s',
\hat{\pi}(s')
\right)
-
\min_{k=1,2}
Q_k(s,a;\theta^Q)
\right)^2
\right]
$$

여기서 $\hat{\pi}$와 $\hat{Q}$는 target policy와 target critic이다. Target network는 Polyak averaging으로 업데이트된다. <br>

Critic은 RL objective에서 중요한 역할을 한다. Behavior cloning만 사용하면 suboptimal intervention에 의해 성능이 제한될 수 있으므로, Q-function은 policy가 human behavior보다 더 나은 action을 찾도록 돕는다.

---

## 8. Actor Optimization

<br>

Actor network $\pi$는 RL objective와 BC objective를 함께 사용하여 학습된다. 논문에서 actor loss는 다음과 같이 정의된다.

$$
\mathcal{L}(\theta^{\pi})
=
\mathbb{E}_{s}
\left[
\frac{1}{\lambda(s)+1}
\left(
-
Q(s,\pi(s;\theta^{\pi}))
+
\lambda(s)
\left\|
\pi(s;\theta^{\pi})
-
\beta(s)
\right\|_2^2
\right)
\right]
$$

이 식은 두 항으로 구성된다.

1. **RL term**

$$
-
Q(s,\pi(s;\theta^{\pi}))
$$

2. **BC term**

$$
\lambda(s)
\left\|
\pi(s;\theta^{\pi})
-
\beta(s)
\right\|_2^2
$$

<br>

$\lambda(s)$가 크면 BC term의 영향이 커진다. 즉, policy는 human behavior policy $\beta$를 더 강하게 따라간다. 반대로 $\lambda(s)$가 작으면 RL term의 영향이 커지고, policy는 critic이 추정한 value를 따라 개선된다. <br>

이를 간단히 나타내면 다음과 같다.

```text
λ(s) large:
Actor loss ≈ Behavior cloning loss
π follows β

λ(s) small:
Actor loss ≈ RL objective
π improves using Q-function
```

<br>

따라서 SiLRI의 actor objective는 상태별로 imitation과 reinforcement learning의 비중을 조절한다.

---

## 9. Lagrange Multiplier Optimization

<br>

Lagrange network $\lambda$는 현재 state를 입력받아 non-negative scalar를 출력한다. Non-negative constraint를 만족시키기 위해 output layer에는 Softplus activation을 사용한다. <br>

Lagrange multiplier의 loss는 다음과 같다.

$$
\mathcal{L}(\theta^{\lambda})
=
\mathbb{E}_{s}
\left[
-
\lambda(s;\theta^{\lambda})
\left(
D(\pi,\beta)
-
\kappa \cdot \sigma_{\beta}
-
c
\right)
\right]
$$

여기서 $D(\pi,\beta)$는 learned policy와 behavior policy 사이의 squared distance이다.

$$
D(\pi,\beta)
=
\left\|
\pi(s;\theta^{\pi})
-
\beta(s)
\right\|_2^2
$$

$c$는 constraint를 완화하기 위한 상수이며, 논문에서는 $c=0.1$을 사용한다. <br>

이 식의 직관은 다음과 같다.

- $D(\pi,\beta)$가 허용 범위보다 크다.
  - learned policy가 behavior policy에서 너무 멀다.
  - $\lambda(s)$가 증가한다.
  - BC constraint가 강해진다.

- $D(\pi,\beta)$가 허용 범위 안에 있다.
  - constraint가 만족된다.
  - $\lambda(s)$가 감소한다.
  - RL objective가 더 크게 작동할 수 있다.

<br>

논문에서는 Lagrange network가 너무 빠르게 커지면 학습이 불안정해질 수 있으므로, Lagrange network의 learning rate를 다른 network보다 훨씬 작게 설정한다.

---

## 10. Behavior Policy Optimization

<br>

Behavior policy $\beta$는 인간 intervention data를 이용해 학습된다. 이를 위해 intervention buffer $D_I$에 저장된 state-action pair를 사용한다. <br>

Behavior policy loss는 다음과 같다.

$$
\mathcal{L}(\theta^{\beta})
=
\mathbb{E}_{(s,a)\sim D_I}
\left[
-
\log
\beta(a|s;\theta^{\beta})
\right]
$$

이는 standard behavior cloning objective이다. 즉, 인간이 제공한 intervention action의 likelihood를 최대화하도록 $\beta$를 학습한다. <br>

중요한 점은 $\beta$가 단순히 mean action만 제공하는 것이 아니라, intervention action distribution의 uncertainty도 제공한다는 점이다. 이 uncertainty가 SiLRI의 state-wise constraint bound로 사용된다.

---

## 11. Human-in-the-loop Training Paradigm

<br>

SiLRI는 asynchronous actor-critic architecture를 기반으로 한다. 학습 전에 human operator는 각 task에 대해 20개의 demonstration trajectory를 수집하고, 이를 intervention buffer $D_I$에 저장한다. <br>

학습 중에는 로봇이 policy에 따라 행동하다가 필요할 때 사람이 intervention을 수행한다. 각 transition은 다음과 같은 형태로 저장된다.

$$
(s_t, a_t, I_t, r_t, d_t, s_{t+1})
$$

여기서 $I_t$는 human intervention 여부를 나타낸다.

$$
I_t
=
\begin{cases}
1, & \text{human intervention} \\
0, & \text{RL exploration}
\end{cases}
$$

<br>

Online data는 online buffer $D_R$에 저장되고, human intervention sample은 intervention buffer $D_I$에도 저장된다. 이후 learner는 두 buffer에서 mini-batch를 sampling하여 $Q$, $\pi$, $\lambda$, $\beta$를 학습한다.

---

## 12. SiLRI Learner Algorithm

<br>

논문에서 제시한 learner-side training procedure는 다음과 같이 정리할 수 있다.

```text
Algorithm: SiLRI Learner

1. Create intervention buffer D_I and online RL buffer D_R.
2. Fill D_I with small-scale human demonstrations.
3. Initialize critic Q, actor π, Lagrange network λ, and behavior policy β.
4. Pre-train β using data from D_I.
5. While training:
    1. Receive transitions from actor.
    2. Store all online transitions into D_R.
    3. Store human intervention transitions into D_I.
    4. Periodically update β using D_I.
    5. Sample mini-batches from D_R and D_I.
    6. Update critic Q.
    7. Update actor π.
    8. Update Lagrange network λ.
    9. Send updated actor parameters to actor process.
```

<br>

이 구조에서 중요한 점은 human intervention data와 online RL data를 모두 사용한다는 것이다. 하지만 이 둘을 단순히 섞어서 사용하는 것이 아니라, behavior policy와 Lagrange multiplier를 통해 상태별로 intervention data의 영향을 조절한다.

---

## 13. Key Design Choices

<br>

논문에서는 실제 로봇 학습을 안정적으로 수행하기 위해 몇 가지 중요한 설계 요소를 사용한다.

---

### 13.1 Intervention Standard Operating Procedure

<br>

Human intervention의 타이밍은 학습 성능에 큰 영향을 준다. 사람이 너무 자주 개입하면 policy가 human assistance에 과도하게 의존할 수 있다. 반대로 너무 늦게 개입하면 실패 trajectory가 많이 쌓여 학습 효율이 떨어질 수 있다. <br>

따라서 논문에서는 **Intervention Standard Operating Procedure (ISOP)**를 사용하여 human operator의 intervention behavior를 일정하게 유지한다.

---

### 13.2 Ever-correcting Reward Classifier

<br>

실세계 로봇 학습에서는 reward classifier가 필요하다. 하지만 offline으로 학습한 reward classifier는 online 환경에서 false positive나 false negative를 만들 수 있다. <br>

논문에서는 이를 해결하기 위해 **ever-correcting reward classifier**를 사용한다. Online training 중 새롭게 correction label이 추가되면 reward classifier를 다시 학습하여 reward prediction을 지속적으로 보정한다.

---

### 13.3 Slow-learning Lagrange Network

<br>

Lagrange multiplier는 upper bound가 없기 때문에 constraint violation이 발생하면 값이 지나치게 커질 수 있다. 이 경우 actor 학습이 불안정해질 수 있다. <br>

이를 방지하기 위해 논문에서는 Lagrange network의 learning rate를 다른 network보다 훨씬 작게 설정한다.

| Network | Learning rate |
| --- | --- |
| $Q$, $\pi$, $\beta$ | $3 \times 10^{-4}$ |
| $\lambda$ | $3 \times 10^{-6}$ |

<br>

즉, $\lambda$는 천천히 학습되도록 하여 전체 학습 안정성을 높인다.

---

## 14. Experimental Setup

<br>

논문에서는 SiLRI를 8개의 실세계 로봇 조작 task에서 평가한다. Task들은 pick-and-place, articulated-object manipulation, precise manipulation, deformable-object handling 등을 포함한다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/silri_real_world_tasks.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Eight real-world manipulation tasks on two embodiments.<br>
    (from Zhao et al., Real-world Reinforcement Learning from Suboptimal Interventions)
</div>
<br>

실험 task는 다음과 같다.

| Task | Description |
| --- | --- |
| Pick-Place Bread | pick-and-place manipulation |
| Pick-up Spoon | precise grasping |
| Fold Rag | deformable object handling |
| Open Cabinet | articulated object manipulation |
| Close Trashbin | articulated object manipulation |
| Push-T | pushing manipulation |
| Hang Chinese Knot | deformable object and long-horizon manipulation |
| Insert USB | precise insertion |

<br>

논문에서는 UR5와 Franka Emika 두 embodiment에서 실험을 수행한다. 두 경우 모두 state는 visual input과 proprioceptive input으로 구성된다. Visual input은 side-view camera와 wrist camera에서 얻는다.

---

## 15. Baselines and Metrics

<br>

논문에서는 SiLRI를 다음 baseline들과 비교한다.

| Method | Description |
| --- | --- |
| HIL-SERL | Human-in-the-loop RL 기반 실세계 조작 방법 |
| ConRFT | VLA model을 위한 reinforced fine-tuning 방법 |
| HG-Dagger | Online imitation learning 방법 |
| SiLRI | Proposed method |

<br>

평가 metric은 다음 세 가지이다.

| Metric | Meaning |
| --- | --- |
| Success Rate | human intervention 없이 robot이 전체 trajectory를 성공한 비율 |
| Intervention Ratio | 전체 step 중 human intervention step의 비율 |
| Episode Length | 한 episode의 총 step 수 |

<br>

논문에서는 success rate를 계산할 때 human intervention이 포함된 episode는 성공으로 보지 않는다. 즉, robot policy 자체가 autonomous하게 task를 완료했는지를 평가한다.

---

## 16. Overall Performance

<br>

논문에서는 5개 task에 대해 episode length, intervention ratio, success rate training curve를 제시한다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/silri_training_curves.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Training curves of episode length, intervention ratio, and success rate.<br>
    (from Zhao et al., Real-world Reinforcement Learning from Suboptimal Interventions)
</div>
<br>

결과적으로 SiLRI는 다른 RL 방법보다 빠르게 높은 success rate에 도달한다. 예를 들어 Open Cabinet task에서 SiLRI는 약 15분의 online training 이후 90% 수준의 success rate에 도달한다. 반면 ConRFT와 HIL-SERL은 유사한 성능에 도달하는 데 더 많은 시간이 필요하다. <br>

이 차이는 SiLRI가 state-wise Lagrange multiplier를 통해 BC objective와 RL objective를 적절히 조절하기 때문이다. 초기에는 BC objective가 학습을 빠르게 도와주고, 이후에는 RL objective가 policy를 더 개선할 수 있도록 한다. <br>

HG-Dagger는 학습 초반에는 좋은 성능을 보이지만, suboptimal human intervention이 계속 추가되는 task에서는 성능이 안정적으로 유지되지 못한다. 예를 들어 Hang Chinese Knot task에서는 SiLRI가 60분 이후 안정적인 100% success rate에 도달하지만, HG-Dagger는 더 낮은 성능으로 떨어진다. <br>

또한 SiLRI는 episode length 측면에서도 좋은 결과를 보인다. Open Cabinet과 Close Trashbin task에서는 HG-Dagger보다 더 짧은 step으로 task를 완료한다.

---

## 17. Robustness Experiments

<br>

논문에서는 SiLRI의 robustness를 확인하기 위해 네 개 task에서 disturbance를 추가한다.

| Task | Disturbance |
| --- | --- |
| Close Trashbin | 로봇이 lid에 접근할 때 trashbin pose를 변경 |
| Push-T | 로봇이 object를 미는 중 T-shaped object를 이동 |
| Hang Chinese Knot | 로봇이 knot을 집기 직전에 knot 위치를 변경 |
| Pick Spoon | 로봇이 spoon을 집기 직전에 spoon을 좌우로 이동 |

<br>

Robustness 결과는 다음과 같다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/silri_robustness_table.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Robustness experiments across four robotic manipulation tasks.<br>
    (from Zhao et al., Real-world Reinforcement Learning from Suboptimal Interventions)
</div>
<br>

SiLRI는 원래 setting뿐 아니라 disturbance setting에서도 다른 방법들보다 좋은 성공률을 보인다. 예를 들어 Close Trashbin task에서 SiLRI는 original setting에서 1.0, disturbance setting에서 0.93의 success rate를 보인다. <br>

반면 HG-Dagger는 original setting에서 0.93의 성공률을 보이지만, disturbance setting에서는 0.07로 크게 떨어진다. 이는 online BC 기반 방법이 제한된 상태분포에 과적합될 수 있음을 보여준다. <br>

SiLRI도 모든 task에서 완전히 동일한 robustness를 유지하는 것은 아니지만, 전반적으로 disturbance 상황에서도 더 나은 recovery 성능을 보인다.

---

## 18. Ablation Studies

<br>

논문에서는 SiLRI의 각 구성요소가 성능에 미치는 영향을 확인하기 위해 ablation study를 수행한다. 실험은 Close Trashbin task에서 진행된다.

비교 대상은 다음과 같다.

| Method | Description |
| --- | --- |
| SiLRI | Full method |
| SiLRI const. | Lagrange multiplier를 constant value로 대체 |
| SiLRI w/o RL | RL objective 제거 |
| SiLRI w/o BC | BC objective 제거 |

<br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/silri_ablation_close_trashbin.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Ablation experiments in the Close Trashbin task.<br>
    (from Zhao et al., Real-world Reinforcement Learning from Suboptimal Interventions)
</div>
<br>

결과를 보면 RL objective를 제거한 경우 성능이 크게 떨어진다. 이는 Q-function을 통한 value guidance가 필요하다는 것을 보여준다. <br>

BC term을 제거한 경우에도 결국 수렴할 수는 있지만, full SiLRI보다 약 13분 늦게 수렴한다. 이는 BC term이 학습 초반 sample efficiency를 높이는 데 중요하다는 것을 의미한다. <br>

Lagrange multiplier를 constant value로 고정한 경우 초반 warm-up은 빠르지만, online training 중 suboptimal intervention이 추가되면서 장기 성능이 떨어질 수 있다. 따라서 state-wise Lagrange multiplier가 RL objective와 BC objective의 균형을 조절하는 데 중요한 역할을 한다.

---

## 19. Intervention Data Quality

<br>

논문에서는 intervention data quality가 학습에 미치는 영향도 분석한다. 이를 위해 skilled operator와 unskilled operator를 비교한다. <br>

Data quality는 성공 episode에 필요한 step 수로 측정한다. Step 수가 적을수록 더 정확하고 효율적인 intervention data라고 볼 수 있다. Push-T task에서 skilled operator는 평균 99 step으로 episode를 완료하고, unskilled operator는 평균 125 step이 필요하다. <br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/silri_data_quality_push_t.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Training curves under skilled and unskilled human operators in the Push-T task.<br>
    (from Zhao et al., Real-world Reinforcement Learning from Suboptimal Interventions)
</div>
<br>

결과적으로 SiLRI는 HG-Dagger보다 intervention quality 변화에 덜 민감하다. HG-Dagger는 intervention data를 직접 imitation하기 때문에 operator skill에 더 크게 영향을 받는다. 반면 SiLRI는 RL objective와 BC objective를 함께 사용하므로, suboptimal intervention이 포함되어도 비교적 안정적인 성능을 유지한다.

---

## 20. Takeaways

<br>

이 논문의 핵심 정리는 다음과 같다.

1. **실세계 HIL-RL에서는 인간 개입이 항상 최적이라고 볼 수 없다.**
   - 특히 정밀 조작이나 deformable object task에서는 인간 action도 불확실할 수 있다.

2. **SiLRI는 인간 개입의 state-wise uncertainty를 활용한다.**
   - 인간 행동이 일관적인 상태에서는 imitation을 강하게 사용하고, 불확실한 상태에서는 RL objective를 더 크게 반영한다.

3. **문제를 constrained RL로 정식화한다.**
   - Learned policy가 human behavior policy에서 너무 멀어지지 않도록 constraint를 두되, constraint bound를 human uncertainty로 조절한다.

4. **State-wise Lagrange multiplier가 RL과 BC의 균형을 조절한다.**
   - $\lambda(s)$가 크면 BC term이 강해지고, $\lambda(s)$가 작으면 RL term이 강해진다.

5. **SiLRI는 빠른 학습과 높은 최종 성능을 보인다.**
   - 여러 실세계 manipulation task에서 HIL-SERL, ConRFT, HG-Dagger보다 빠르게 높은 success rate에 도달한다.

6. **Robustness와 data quality 측면에서도 좋은 결과를 보인다.**
   - Disturbance 상황에서 더 높은 recovery 성능을 보이며, operator skill 차이에 대해서도 상대적으로 안정적이다.

---

## Conclusion

<br>

이 논문은 실세계 로봇 조작 문제에서 suboptimal human intervention을 효과적으로 활용하기 위한 **SiLRI** 방법을 제안한다. <br>

SiLRI는 인간 개입 데이터를 단순히 최적 행동으로 가정하지 않고, 상태별 인간 행동의 uncertainty를 고려한다. 인간이 일관된 행동을 제공하는 상태에서는 learned policy가 behavior policy에 가깝게 유지되도록 하고, 인간 행동이 불확실한 상태에서는 RL objective가 더 큰 역할을 하도록 한다. <br>

이를 위해 논문은 constrained RL formulation을 사용하고, state-wise Lagrange multiplier를 학습하여 RL objective와 BC objective의 균형을 조절한다. <br>

실험 결과, SiLRI는 8개의 실세계 로봇 조작 task에서 기존 HIL-RL 및 online IL 방법보다 빠르게 높은 성공률에 도달했으며, 일부 장기 조작 task에서는 다른 방법들이 어려움을 겪는 상황에서도 100% 성공률을 달성했다. <br>

따라서 이 논문은 인간 개입 데이터를 그대로 모방하는 것이 아니라, 그 신뢰도와 불확실성을 고려하여 실세계 강화학습에 활용하는 방법을 보여준다.