---
layout: post
title: "[Paper Review] Predictive Safety Filter for Learning-Based Control"
description: "Constrained nonlinear dynamical system에서 learning-based controller의 입력을 predictive safety filter로 안전하게 검증하는 방법"
date: 2026-06-07 10:00:00 +0900
tags: [predictive safety filter, safe reinforcement learning, model predictive control, constrained control, data-driven control]
categories: [control, reinforcement learning, optimization]
related_posts: True
giscus_comments: true
pretty_table: true
toc:
  sidebar: left
---

## Introduction

<br>

이번 포스트에서는 Wabersich and Zeilinger의 **A Predictive Safety Filter for Learning-Based Control of Constrained Nonlinear Dynamical Systems** 논문을 정리한다. <br>

이 논문은 reinforcement learning 또는 learning-based control을 실제 물리 시스템에 적용할 때 발생하는 핵심 문제, 즉 **state constraint와 input constraint를 어떻게 만족시킬 것인가**를 다룬다. RL은 복잡하고 고차원적인 control task에서 좋은 성능을 보일 수 있지만, 대부분의 RL 알고리즘은 상태 제약과 입력 제약을 명시적으로 다루지 않는다. 반면 실제 시스템에는 actuator saturation, torque limit, power limit, collision avoidance, altitude constraint처럼 반드시 지켜야 하는 물리적·안전상 제약이 존재한다. <br>

논문의 핵심 아이디어는 다음과 같다.

> Learning-based controller가 제안한 입력을 실제 시스템에 바로 넣지 말고,  
> predictive safety filter가 그 입력을 안전하게 적용할 수 있는지 먼저 검사한다.

Learning-based controller는 성능을 위해 입력을 제안한다.

$$
u_L(k)=\pi_L(k,x(k))
$$

Predictive safety filter는 현재 상태 $x(k)$와 learning input $u_L(k)$를 받아, 실제 시스템에 넣을 입력을 결정한다.

$$
u(k)=\pi_S(k,x(k),u_L(k))
$$

만약 $u_L(k)$가 안전하다고 certify되면 그대로 적용한다. 그렇지 않으면 safety filter가 입력을 최소한으로 수정한다. 즉, 이 논문에서 PSF는 새로운 RL 알고리즘이라기보다, **임의의 RL 알고리즘 또는 learning-based controller 위에 붙일 수 있는 safety certification layer**이다. <br>

논문은 이 safety filter를 MPC-inspired optimization problem으로 구성한다. 하지만 일반적인 MPC와는 목적이 다르다. MPC가 보통 task performance를 최적화하는 controller라면, PSF는 learning input을 최대한 유지하면서 safety만 보장하는 filter이다.

<br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/psf_fig1_concept.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Concept of predictive safety filter: Based on the current state x(k), a learning-based algorithm provides a control input u<sub>L</sub>(k) = π<sub>L</sub>(k, x(k)) ∈ R<sup>m</sup>, which is processed by the safety filter u(k) = π<sub>S</sub>(k, x(k), u<sub>L</sub>(k)) and applied to the real system.
</div>
<br>

Fig. 1은 논문의 전체 구조를 보여준다. RL controller는 입력 $u_L(k)$를 제안하고, predictive safety filter는 이를 받아 실제 시스템에 적용할 입력 $u(k)$를 만든다. 따라서 RL 알고리즘은 원래 constrained system을 직접 제어하는 것이 아니라, safety filter가 붙은 safe system에 대해 동작하게 된다.

---

## 1. Problem Statement

<br>

논문에서 고려하는 시스템은 deterministic discrete-time nonlinear system이다.

$$
x(k+1)=f(x(k),u(k);\theta_R),
\qquad
\forall k\in \mathbb{I}_{\geq 0}
$$

여기서 $x(k)\in \mathbb{R}^n$는 상태, $u(k)\in \mathbb{R}^m$는 입력, $\theta_R$은 실제 시스템의 unknown parameter이다. 초기 상태 $x(0)=x_{\text{init}}$은 알려진 분포 $p(x_{\text{init}})$를 따른다고 둔다. <br>

시스템에는 state constraint와 input constraint가 존재한다.

$$
X:=\{x\in \mathbb{R}^n\mid A_xx\leq \mathbf{1}_{n_x}\}
$$

$$
U:=\{u\in \mathbb{R}^m\mid A_uu\leq \mathbf{1}_{n_u}\}
$$

즉, 모든 시간에 대해 다음이 만족되어야 한다.

$$
x(k)\in X,\qquad u(k)\in U
$$

실제 parameter $\theta_R$은 unknown이지만, 데이터로부터 추정한 parameter distribution이 있다고 가정한다.

$$
\theta \sim p(\theta)
$$

그리고 이 분포의 평균을

$$
\bar{\theta}=E[\theta]
$$

로 둔다.

<br>

학습 기반 policy는 다음과 같이 주어진다.

$$
\pi_L:\mathbb{I}_{\geq 0}\times X\rightarrow U
$$

즉, 학습기는 현재 상태 $x(k)$를 보고 다음 입력을 제안한다.

$$
u_L(k)=\pi_L(k,x(k))
$$

논문에서 고려하는 learning objective는 episodic finite-time 또는 infinite horizon objective이다.

$$
J_{\bar{N}}(x(k))
=
E
\left[
\sum_{i=k}^{\bar{N}}
\ell(x(i),\pi_L(i,x(i)))
\right]
$$

stage cost는 deterministic part와 zero-mean noise로 구성된다.

$$
\ell(x,u)=\bar{\ell}(x,u)+w_{\ell}
$$

하지만 이 논문의 중심 목표는 objective를 직접 최적화하는 것이 아니다. 핵심은 learning policy를 적용하는 동안 state/input constraints를 원하는 probability level에서 만족시키는 것이다.

---

## 2. Safety Requirement

<br>

논문에서 safety는 다음 chance constraint로 정의된다.

$$
Pr
\left(
\forall k\in \mathbb{I}_{[0,\bar{N}]}:
x(k)\in X,\ u(k)\in U
\right)
\geq p_S
$$

여기서 $p_S>0$는 desired safety probability level이다.

이 식은 단순히 다음 step 하나가 안전하다는 의미가 아니다. 전체 시간 구간 동안 모든 상태와 입력이 제약을 만족해야 한다. 즉, 논문이 다루는 safety는 one-step constraint satisfaction보다 강하다. <br>

이제 문제는 다음과 같이 정리된다.

> 임의의 learning-based controller가 제안한 입력 $u_L(k)$를 받아,  
> 실제 시스템에 적용되는 입력 $u(k)$를 선택하는 safety filter $\pi_S$를 설계하라.  
> 이때 closed-loop system은 원하는 확률 $p_S$ 이상으로 모든 시간의 state/input constraints를 만족해야 한다.

Safety filter가 붙으면 실제 시스템에 적용되는 입력은 다음과 같다.

$$
u(k)=\pi_S(k,x(k),u_L(k))
$$

그리고 learning algorithm 입장에서 보면, 원래 constrained system 대신 다음 safe system을 제어하는 것처럼 볼 수 있다.

$$
f_S(k,x(k),u_L(k))
:=
f(x(k),\pi_S(k,x(k),u_L(k)))
$$

논문은 이 점을 강조한다. 즉, predictive safety filter는 safety-critical constrained task를 RL 입장에서는 unconstrained task처럼 바꾸는 역할을 한다.

---

## 3. Safety Certified Learning Input

<br>

논문은 먼저 learning input이 safe하다는 것이 무엇인지 정의한다.

어떤 time step $\bar{k}$에서 learning input $u_L(\bar{k})$가 safe certified 되려면, 첫째로 safety filter가 그 입력을 수정하지 않아야 한다.

$$
\pi_S(\bar{k},x(\bar{k}),u_L(\bar{k}))=u_L(\bar{k})
$$

둘째로, 그 이후에도 safety filter를 적용했을 때 all-time safety가 성립해야 한다.

즉, $k\geq \bar{k}$에 대해

$$
u(k)=\pi_S(k,x(k),u_L(k))
$$

를 적용하면 safety condition이 유지되어야 한다.

이 정의에 따라 safety filter의 목표는 명확하다.

> 가능한 많은 learning input을 그대로 certify하되,  
> certify할 수 없는 입력은 가장 작게 수정하여 safe input을 제공한다.

따라서 unsafe한 learning input에 대해서는 다음과 같이 된다.

$$
u(k)=\pi_S(k,x(k),u_L(k))\neq u_L(k)
$$

그리고 filter는 보통 다음 차이를 작게 만들고자 한다.

$$
\|\pi_S(k,x(k),u_L(k))-u_L(k)\|_2
$$

이것이 PSF의 minimal intervention 철학이다.

---

## 4. Nominal Predictive Safety Filter

<br>

논문은 먼저 직관을 위해 perfect model knowledge가 있는 단순한 경우를 다룬다. 이 경우 어떤 confident subset $Z_c\subseteq X\times U$가 존재해서, 그 안에서는 평균 모델과 실제 모델이 정확히 일치한다고 가정한다.

$$
f(x,u;\bar{\theta})=f(x,u;\theta_R),
\qquad
\forall (x,u)\in Z_c
$$

Nominal PSF는 offline으로 미리 계산되는 것이 아니라, 매 시간 online optimization problem으로 정의된다. 핵심 메커니즘은 **safe backup plan**을 찾는 것이다. <br>

시간 $k$에서 planning horizon $N$에 대해 예측 상태와 입력을 다음과 같이 둔다.

$$
x_{i|k,N},\qquad u_{i|k,N}
$$

여기서 $i$는 현재 시간 $k$로부터 $i$ step 뒤를 의미한다. Nominal PSF는 다음 문제를 푼다.

$$
\min_{\{u_i\}}
\|u_L-u_{0|k}\|
$$

subject to

$$
\forall i\in \mathbb{I}_{[0,N-1]}:
$$

$$
x_{i+1|k}=f(x_{i|k},u_{i|k};\bar{\theta})
$$

$$
x_{i|k}\in X
$$

$$
u_{i|k}\in U
$$

$$
(x_{i|k},u_{i|k})\in Z_c
$$

$$
x_{N|k}\in S^t
$$

$$
x_{0|k}=x(k)
$$

목적함수는 task cost가 아니다. 오직 learning input $u_L(k)$와 첫 번째 backup input $u_{0\vert k}$의 차이를 줄인다.

$$
\min \|u_L(k)-u_{0|k}\|
$$

따라서 $u_L(k)$가 안전하면 최적해는 $u_{0\vert k}^{\ast}=u_L(k)$가 된다. 반대로 $u_L(k)$를 그대로 쓰면 terminal safe set으로 가는 safe backup plan이 없으면, PSF는 $u_L(k)$를 최소한으로 수정한다.

---

## 5. Terminal Safe Set and Shrinking Horizon

<br>

Nominal PSF에서 중요한 조건은 terminal safe set이다.

$$
S^t:=\{x\in \mathbb{R}^n\mid a_S(x)\leq \mathbf{1}_{n_S}\}\subseteq X
$$

논문은 다음을 가정한다. 어떤 terminal safety filter $\pi_S^t$가 존재해서, 만약 어떤 시간 $\bar{k}$에서

$$
x(\bar{k})\in S^t
$$

이면, 이후

$$
u(k)=\pi_S^t(k,x(k),u_L(k))
$$

를 적용했을 때 모든 미래 시간에 대해

$$
x(k)\in X,\qquad u(k)\in U
$$

가 성립한다.

즉, $S^t$는 목표 set이 아니라 **안전하게 머무를 수 있는 terminal safe set**이다. 논문은 $S^t$를 nonlinear robust MPC의 terminal set, 안정한 steady-state 주변 영역, 또는 expert knowledge를 이용해 선택할 수 있다고 설명한다. <br>

Nominal PSF의 safety는 shrinking horizon mechanism으로 유지된다.

시간 $k-1$에서 horizon $N$ 문제의 feasible solution이 있었다고 하자.

$$
\{u_{i|k-1,N}^{\ast}\}_{i=0}^{N-1}
$$

첫 입력을 적용하면

$$
u(k-1)=u_{0|k-1,N}^{\ast}
$$

이고, 모델이 정확하므로 다음 상태는 예측 상태와 일치한다.

$$
x(k)=x_{1|k-1,N}^{\ast}
$$

이제 시간 $k$에서 horizon $N$ 문제를 새로 풀 수 있으면 그 해를 사용한다. 그런데 만약 horizon $N$ 문제가 infeasible하면, 이전에 계산한 plan의 tail을 사용할 수 있다.

$$
u_{i|k}=u_{i+1|k-1,N}^{\ast},
\qquad
i\in \mathbb{I}_{[0,N-2]}
$$

즉, horizon $N-1$짜리 feasible plan이 존재한다. 만약 이후에도 full horizon problem이 계속 infeasible하면 horizon을 계속 줄인다.

$$
N,\ N-1,\ N-2,\ldots,0
$$

horizon이 0이 되면 상태는 terminal safe set에 도달해 있고, 이후에는 terminal safety filter $\pi_S^t$를 사용한다.

<br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/psf_fig2_nominal_and_uncertain.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    The basic idea of the predictive safety filter explained using a nominal, simplified version in the left column and the final method on the right. The illustrations show the system state at time k with safe backup plan for a shorter horizon obtained from the solution at time k−1, depicted in brown, and areas with poor model quality in red. An arbitrary learning input u<sub>L</sub> is certified if a feasible solution towards the terminal safe set S<sup>t</sup> can be found, as shown in green. If this new backup solution cannot be found and the planning problem (5)/(6) is infeasible, the system can be driven to the safe set S<sup>t</sup> along the brown previously computed trajectory. Left (NPSF): By assuming perfect system knowledge, the computed backup plans correspond exactly to the true state dynamics and constraints are guaranteed to be satisfied using the nominal backup trajectory. Right (PSF): Backup plans are computed w.r.t. the nominal expected state μ. The true state trajectory lies within a growing tube around the nominal state with probability p<sub>S</sub>, which needs to be considered using tightened constraints according to (9). (For interpretation of the references to color in this figure legend, the reader is referred to the web version of this article.)
</div>
<br>

Fig. 2의 왼쪽은 nominal PSF를 보여준다. 초록색 trajectory는 현재 시점에서 새로 찾은 feasible backup plan이고, 갈색 trajectory는 이전 time step에서 계산된 backup plan의 tail이다. 새 backup plan을 찾을 수 없으면 갈색 trajectory를 따라 terminal safe set으로 이동한다.

---

## 6. Predictive Safety Filter with Model Uncertainty

<br>

Nominal PSF는 모델이 정확히 알려져 있다고 가정했다. 그러나 실제 learning-based control에서는 아직 탐색하지 않은 영역이 있고, 그 영역에서는 모델이 부정확할 수 있다.

논문은 이를 다루기 위해 평균 모델을 사용한다.

$$
f(x,u;\bar{\theta})
$$

실제 시스템은

$$
f(x,u;\theta_R)
$$

로 움직이므로 model error가 존재한다.

$$
e(k,\theta_R)
:=
f(x(k),u(k);\theta_R)
-
f(x(k),u(k);\bar{\theta})
$$

논문은 먼저 uniform error bound를 생각한다.

$$
Pr
\left(
e(k,\theta_R)\in E
\text{ for all } k\in \mathbb{I}_{\geq 0}
\right)
\geq p_S
$$

여기서

$$
E:=\{e\in \mathbb{R}^n\mid a_E(e)\leq \mathbf{1}_{n_E}\}
$$

이다. $a_E$는 Lipschitz continuous이고, linearly bounded from below라고 가정한다.

이제 backup plan은 실제 state가 아니라 nominal expected state에 대해 계산된다.

$$
\mu_{i+1|k}=f(\mu_{i|k},v_{i|k};\bar{\theta})
$$

여기서 $\mu_{i\vert k}$는 평균 모델에 의해 예측된 nominal state이고, $v_{i\vert k}$는 nominal input이다.

문제는 nominal prediction이 제약을 만족하더라도 실제 시스템은 model error 때문에 제약을 위반할 수 있다는 점이다.

예를 들어

$$
\mu_{1|k}^{\ast}\in X
$$

라고 해도 실제 다음 상태

$$
x(k+1)
$$

가 $X$ 안에 있다는 보장은 없다. 따라서 model uncertainty를 고려한 margin이 필요하다.

---

## 7. Constraint Tightening

<br>

논문은 robust MPC에서 사용하는 방식과 유사하게 constraint tightening을 도입한다. 상태 제약, 입력 제약, terminal set을 다음과 같이 줄인다.

$$
\bar{X}_i
:=
\{x\in \mathbb{R}^n
\mid
A_xx\leq (1-\epsilon_i)\mathbf{1}_{n_x}
\}
$$

$$
\bar{U}_i
:=
\{u\in \mathbb{R}^m
\mid
A_uu\leq (1-\epsilon_i)\mathbf{1}_{n_u}
\}
$$

$$
\bar{S}_N^f
:=
\{x\in \mathbb{R}^n
\mid
a_S(x)\leq (1-\epsilon_N)\mathbf{1}_{n_S}
\}
$$

즉, nominal backup trajectory는 원래 제약 $X$, $U$, $S^t$가 아니라 더 작은 set인 $\bar{X}_i$, $\bar{U}_i$, $\bar{S}_N^f$ 안에 있어야 한다.

이 tightening은 model error로 인한 deviation을 보상하기 위한 것이다. Nominal trajectory가 제약 경계보다 안쪽에 있으면, 실제 trajectory가 model error 때문에 nominal trajectory 주변으로 벗어나도 원래 constraint를 만족할 수 있다.

<br>

tightening factor는 다음 recursion으로 정의된다.

$$
\epsilon_0:=0
$$

$$
\epsilon_{i+1}:=\epsilon_i+\sqrt{\rho^i}\epsilon
$$

따라서

$$
\epsilon_i
=
\epsilon
\frac{1-\sqrt{\rho}^{\,i}}
{1-\sqrt{\rho}}
$$

여기서 $\epsilon>0$은 design parameter이고, $\rho\in(0,1)$는 시스템이 nominal reference trajectory와의 거리를 얼마나 빠르게 줄일 수 있는지를 나타내는 contraction rate이다.

논문은 이를 Assumption 4.3으로 formalize한다. 어떤 tracking policy

$$
\pi:X\times X\times U\rightarrow \mathbb{R}^m
$$

와 함수

$$
V:X\times X\times U\rightarrow \mathbb{R}_{\geq 0}
$$

가 존재해서 다음 조건을 만족한다고 가정한다.

$$
c_l\|x-\mu\|_2^2
\leq
V(x,\mu,v)
\leq
c_u\|x-\mu\|_2^2
$$

그리고 $V(x,\mu,v)\leq \delta$이면,

$$
\|\pi(x,\mu,v)-v\|_2
\leq
\pi_{\max}\|x-\mu\|_2
$$

또한

$$
V
\left(
f(x,\pi(x,\mu,v);\bar{\theta}),
f(\mu,v;\bar{\theta}),
v^+
\right)
\leq
\rho V(x,\mu,v)
$$

이다.

직관적으로 $V$는 실제 상태 $x$와 nominal state $\mu$ 사이의 tracking error energy이다. $\rho$는 이 error가 얼마나 빠르게 줄어드는지를 나타낸다. $\rho$가 작으면 reference를 빠르게 따라잡을 수 있고, $\rho$가 1에 가까우면 tracking error가 천천히 줄어든다.

중요한 점은 실제 algorithm이 이 tracking policy $\pi$와 함수 $V$의 explicit form을 필요로 하지는 않는다는 것이다. 논문에서 이들은 안전성 증명, 특히 recursive feasibility를 보이기 위한 존재 조건으로 사용된다.

---

## 8. Planning in Confident Subspaces

<br>

Uniform error bound는 안전성을 설명하는 데 유용하지만, 실제로는 지나치게 보수적일 수 있다. 모델 uncertainty는 상태-입력 공간 전체에서 균일하지 않다. 데이터가 많은 영역에서는 uncertainty가 작고, 데이터가 적은 영역에서는 uncertainty가 클 수 있다.

논문은 이를 줄이기 위해 **confident subset**에서만 planning하도록 한다.

먼저 reduced allowable error set을 정의한다.

$$
E^{\gamma}
:=
\{e\in \mathbb{R}^n
\mid
a_E(e)\leq \gamma \mathbf{1}_{n_E}
\},
\qquad
0<\gamma\leq 1
$$

여기서 $\gamma$는 maximum allowable uncertainty의 크기를 조절하는 scaling factor이다. $\gamma$가 작을수록 허용되는 model error가 작다.

문제는 실제 model error

$$
e(k,\theta_R)
$$

를 직접 알 수 없다는 것이다. 따라서 $e(k,\theta_R)\in E^{\gamma}$를 직접 constraint로 넣을 수 없다.

이를 위해 논문은 set-valued model confidence map을 정의한다.

$$
E_{p_S}(x,u)
$$

이 map은 상태-입력 쌍 $(x,u)$에서 가능한 model error들의 집합을 반환한다. Definition 4.4에 따르면 $E_{p_S}$는 다음을 만족해야 한다.

$$
Pr
\left(
e(k,\theta_R)\in E_{p_S}(x(k),u(k)),
\forall k\in \mathbb{I}_{[0,\bar{N}]}
\right)
\geq p_S
$$

즉, 전체 시간에 대해 실제 model error가 confidence map 안에 들어갈 확률이 $p_S$ 이상이어야 한다.

이제 confident subset에서 planning한다는 조건은 다음과 같이 표현된다.

$$
E_{p_S}(x(k),u(k))\subseteq E^{\gamma}
$$

실제 PSF optimization에서는 이 조건을 nominal plan 위에 tightened form으로 적용한다.

$$
E_{p_S}(\mu_{i|k},v_{i|k})
\subseteq
\bar{E}_i^{\gamma}
$$

여기서

$$
\bar{E}_i^{\gamma}
:=
\{e\in \mathbb{R}^n
\mid
a_E(e)\leq
\gamma(1-\epsilon_i)\mathbf{1}_{n_E}
\}
$$

이다.

이 조건의 의미는 다음이다.

> Nominal backup trajectory의 각 state-input pair에서 가능한 model error set이  
> 허용 가능한 작은 error set 안에 들어와야 한다.

따라서 PSF는 모델이 충분히 confident한 영역에서만 backup trajectory를 계획한다. 이것이 논문에서 말하는 **cautious exploration beyond available data**의 핵심이다.

---

## 9. Data-Driven Set-Valued Model Confidence Map

<br>

논문은 Bayesian regression을 예로 들어 confidence map을 어떻게 구성할 수 있는지 설명한다.

데이터셋을 다음과 같이 둔다.

$$
D
=
\{(x_i,u_i),f(x_i,u_i;\theta_R)\}_{i=1}^{N_D}
$$

이 데이터로부터 posterior distribution을 얻는다.

$$
\theta\sim p(\theta|D)
$$

그리고 probability level $p_S$에 대한 confidence region을

$$
C_{p_S}(p(\theta|D))
$$

라고 하자.

그러면 set-valued model confidence map은 다음과 같이 정의할 수 있다.

$$
E_{p_S}(x,u)
=
\left\{
e\in \mathbb{R}^n
\mid
e=f(x,u,\theta)-f(x,u;\bar{\theta}),
\ \theta\in C_{p_S}(p(\theta|D))
\right\}
$$

즉, posterior confidence region 안에 있는 parameter들이 만들어낼 수 있는 model error들의 집합을 confidence map으로 사용한다.

이 방식은 데이터가 많은 영역에서는 작은 confidence set을 만들고, 데이터가 부족한 영역에서는 큰 confidence set을 만든다. 결과적으로 PSF는 모델을 잘 아는 영역에서는 덜 보수적으로, 모델을 잘 모르는 영역에서는 더 보수적으로 동작한다.

논문은 Gaussian process regression을 사용하는 경우에도 유사한 model confidence map을 만들 수 있다고 언급한다.

---

## 10. Final Predictive Safety Filter Problem

<br>

이제 논문의 최종 predictive safety filter problem을 정리할 수 있다. 최종 PSF는 nominal state sequence $\{\mu_{i \vert k}\}$와 nominal input sequence $\{v_{i \vert k}\}$를 최적화한다.

목적은 learning input $u_L(k)$와 첫 번째 nominal input $v_{0|k}$의 차이를 최소화하는 것이다.

$$
\min_{\{v_i\}_{i\in \mathbb{I}_{[0,N-1]}}}
\|u_L-v_{0|k}\|
$$

subject to

$$
\forall i\in \mathbb{I}_{[0,N-1]}:
$$

$$
\mu_{i+1|k}
=
f(\mu_{i|k},v_{i|k};\bar{\theta})
$$

$$
\mu_{i|k}\in \bar{X}_i
$$

$$
v_{i|k}\in \bar{U}_i
$$

$$
E_{p_S}(\mu_{i|k},v_{i|k})
\subseteq
\bar{E}_i^{\gamma}
$$

$$
\mu_{N|k}\in \bar{S}_N^f
$$

$$
\mu_{0|k}=x(k)
$$

<br>

각 constraint의 의미는 다음과 같다.

| Constraint | Meaning |
| --- | --- |
| $\mu_{i+1|k}=f(\mu_{i|k},v_{i|k};\bar{\theta})$ | 평균 모델에 대한 nominal backup trajectory |
| $\mu_{i|k}\in \bar{X}_i$ | model error를 고려한 tightened state constraint |
| $v_{i|k}\in \bar{U}_i$ | model error를 고려한 tightened input constraint |
| $E_{p_S}(\mu_{i|k},v_{i|k})\subseteq \bar{E}_i^{\gamma}$ | confident subset에서만 planning |
| $\mu_{N|k}\in \bar{S}_N^f$ | terminal safe set으로의 도달 |
| $\mu_{0|k}=x(k)$ | 현재 실제 상태에서 planning 시작 |

이 문제가 논문 Fig. 2의 오른쪽 column에 있는 online problem (6)이다.

PSF는 매 시간 horizon $N$에 대해 이 문제를 풀어본다. Feasible하면 최적 첫 입력을 적용한다.

$$
u(k)=v_{0|k}^{\ast}
$$

만약 horizon $N$ 문제를 풀 수 없다면, Algorithm 2는 이전에 계산해둔 backup plan을 바탕으로 shorter horizon 문제를 푼다. 그리고 horizon이 0에 도달하면 terminal safety filter $\pi_S^t$를 사용한다.

---

## 11. Safety Guarantee

<br>

이제 중요한 질문은 이것이다.

> 위의 PSF optimization을 사용하면 정말 safety를 보장할 수 있는가?

논문의 main result는 Theorem 4.6이다.

Theorem 4.6은 Assumption 4.2, 4.3, 4.5가 성립한다고 가정한다. 즉,

- terminal safe set과 terminal safety filter가 존재하고,
- nominal trajectory 주변에서 tracking error를 수축시킬 수 있으며,
- model confidence map이 Hausdorff metric 기준으로 Lipschitz continuous하다고 가정한다.

이때 tightening factor $\epsilon>0$를 선택하고, model confidence map의 Lipschitz constant가 충분히 작다면, 충분히 작은 $\gamma>0$를 선택할 수 있다. 그러면 초기 상태 $x(0)$에서 PSF problem (6)이 feasible하다는 조건 아래에서 Algorithm 2는 다음 safety condition을 보장한다.

$$
Pr
\left(
\forall k:
x(k)\in X,\ u(k)\in U
\right)
\geq p_S
$$

이 정리의 의미는 다음이다.

> 초기 feasible backup plan이 있고, model confidence가 충분히 regular하며, 허용 model error를 충분히 작게 설정하면, PSF는 모든 시간에 대해 state/input constraints를 확률 $p_S$ 이상으로 만족시킨다.

Theorem 4.6은 PSF가 단순 heuristic filter가 아니라, 조건부로 rigorous probabilistic safety guarantee를 갖는다는 점을 보여준다.

---

## 12. Interpretation of Design Parameters

<br>

논문은 Section 4.3에서 PSF의 design parameters를 해석한다. 중요한 parameter는 다음 네 개이다.

$$
\rho,\qquad \epsilon,\qquad \gamma,\qquad p_S
$$

### 12.1 $\rho\in(0,1)$

<br>

$\rho$는 시스템이 nominal reference trajectory와의 거리를 얼마나 빠르게 줄일 수 있는지를 나타내는 minimum contraction rate이다.

극단적으로 deadbeat controller처럼 한 step 안에 reference로 갈 수 있다면

$$
\rho\approx 0
$$

로 볼 수 있다. 이 경우 constraint tightening은 한 step 이후 거의 증가하지 않는다.

반대로 시스템이 reference trajectory에 매우 느리게 수렴한다면

$$
\rho\approx 1
$$

이고, 이는 constraint tightening 관점에서 worst case에 가깝다.

논문은 cautious choice로

$$
\rho:=0.99
$$

를 제시한다.

### 12.2 $\epsilon>0$

<br>

$\epsilon$은 predicted backup plan을 따라 적용되는 constraint tightening factor이다.

$\rho$는 시스템의 intrinsic property와 관련되지만, $\epsilon$은 design parameter이다. $\epsilon$은 허용 가능한 model error 크기와 PSF의 conservatism 사이 trade-off를 만든다.

논문의 Appendix 분석에 따르면 $\gamma$에 대한 충분조건은 $\epsilon$에 선형적으로 비례하는 형태를 가진다.

$$
\gamma\leq c_{\gamma}\epsilon
$$

즉, 더 큰 model uncertainty를 허용하려면 더 큰 constraint tightening이 필요하다.

하지만 $\epsilon$이 너무 크면 tightened set이 비어버릴 수 있다. 이를 피하기 위한 cautious initial choice로 논문은 다음을 제시한다.

$$
\epsilon
\leq
\frac{1-\sqrt{\rho}}
{1-\sqrt{\rho}^{\,N}}
$$

### 12.3 $\gamma>0$

<br>

$\gamma$는 reduced allowable error set $E^{\gamma}$의 크기를 정한다.

$$
E^{\gamma}
=
\{e\mid a_E(e)\leq \gamma \mathbf{1}_{n_E}\}
$$

논문은 $e\in E^{\gamma}$이면 다음과 같은 선형 bound가 성립한다고 설명한다.

$$
\max_{e\in E^{\gamma}}\|e\|_2
\leq
\gamma\frac{\sqrt{n_E}}{c_E}
$$

즉, $\gamma$는 confident subset에서 허용되는 maximum uncertainty에 선형적으로 영향을 준다.

$\gamma$가 작으면 model confidence constraint가 보수적이 된다. 따라서 tuning의 목표는 주어진 $(\rho,\epsilon)$에 대해 안전성을 유지하면서 가능한 큰 $\gamma$를 찾는 것이다.

### 12.4 $p_S\in[0,1]$

<br>

$p_S$는 desired probability level of safety이다.

$$
Pr
\left(
\forall k:
x(k)\in X,\ u(k)\in U
\right)
\geq p_S
$$

$p_S$가 낮으면 confidence map이 작아질 수 있어 exploration이 쉬워진다. 극단적으로 $p_S=0$이면

$$
E_{p_S}=\{0\}
$$

처럼 선택할 수 있고, 사실상 model confidence map constraint를 비활성화하는 것과 같다.

반대로

$$
p_S\approx 1
$$

이면 robust version의 PSF에 가까워지고 exploration은 제한된다.

논문은 application에 따라 exploration phase에서는 낮은 $p_S$를 쓰고, long-term operation에서는 높은 $p_S$를 enforcing할 수 있다고 설명한다.

<br>

정리하면 cautious initial selection은 다음과 같다.

$$
\rho\approx 1,\qquad
\epsilon\approx N^{-1},\qquad
\gamma \text{ small}
$$

이후 Appendix A.3의 offline verification을 통해 parameter choice를 확인할 수 있다.

---

## 13. Numerical Example 1: Pendulum Swing-Up

<br>

첫 번째 예제는 pendulum swing-up이다. 목표는 downward position에서 시작해 upward position으로 swing-up하는 것이다.

초기 downward position은

$$
\alpha=0^\circ
$$

이고, 목표 upward position은

$$
\alpha=180^\circ
$$

이다.

하지만 safety constraint가 존재한다.

$$
-90^\circ\leq \alpha\leq 190^\circ
$$

즉, pendulum이 upward position에 도달한 뒤 과도하게 넘어가는 것이 금지된다.

Pendulum dynamics는 다음과 같이 discretized된다.

$$
x_1(k+1)=x_1(k)+hx_2(k)
$$

$$
x_2(k+1)
=
x_2(k)
-
\frac{hg}{l}\sin(x_1(k))
-
\frac{h\eta}{ml^2}x_2(k)
+
\frac{h}{ml^2}u(k)
$$

여기서

$$
x_1(k)=\alpha(k)
$$

는 angle이고,

$$
x_2(k)=\dot{\alpha}(k)
$$

는 angular velocity이다.

논문에서 사용한 parameter는 다음과 같다.

$$
h=0.02\,[s]
$$

$$
g=9.81\,[m/s^2]
$$

$$
l=0.5\,[m]
$$

$$
m=0.15\,[kg]
$$

$$
\eta=0.1\,[Nms/rad]
$$

입력 torque는 다음 범위로 제한된다.

$$
|u|\leq 0.7
$$

---

## 14. Unsafe Learning Policy for Pendulum

<br>

Pendulum 예제의 learning policy는 neural network가 아니라 bang-bang open-loop input signal이다.

$$
\pi_L(k;k_{s1},k_{s2})
=
\begin{cases}
-0.7, & k\leq k_{s1}\\
0.7, & k_{s1}\leq k\leq k_{s2}\\
0, & \text{else}
\end{cases}
$$

학습할 parameter는 switching time이다.

$$
k_{s1},\qquad k_{s2}
$$

조건은 다음과 같다.

$$
k_{s1}\in[0,k_{s2}]
$$

$$
k_{s2}\in[0,150]
$$

Learning episode horizon은

$$
\bar{N}=120
$$

이다.

Stage cost는 다음과 같이 정의된다.

$$
\ell(x,k)
=
(\alpha(k)-\pi)^2
+
(v_{0|k}^{\ast}-\pi_L(k;k_{s1},k_{s2}))^2
$$

첫 번째 항은 upward position $180^\circ$와의 거리이다. 두 번째 항은 safety filter가 learning input을 얼마나 수정했는지, 즉 safety-ensuring intervention을 penalize한다.

논문은 Bayesian Optimization을 사용해 switching time $k_{s1}$, $k_{s2}$를 학습한다. PSF 없이 이 policy를 직접 적용하면 swing-up은 달성될 수 있지만, Fig. 3 top에 보이듯 significant constraint violation이 발생한다.

---

## 15. Predictive Safety Filter from Data for Pendulum

<br>

Pendulum 예제에서 transition model은 linear Bayesian regression으로 얻는다.

$$
f(x,u)=\theta^\top\phi(x,u)
$$

feature는 다음과 같다.

$$
\phi(x,u)
=
[x_1,\ x_2,\ \sin(x_1),\ u]^\top
$$

unknown parameter는

$$
\theta\in \mathbb{R}^{2\times 4}
$$

이고, Gaussian prior와 Gaussian measurement noise를 사용한다.

Set-valued model confidence map은 ellipsoid 형태로 정의된다.

$$
E_{p_S}(x,u)
=
\{e\in \mathbb{R}^n
\mid
e^\top \Sigma^{-1}(x,u)e
\leq
\chi_2^2(p_S)
\}
$$

여기서

$$
\Sigma(x,u)
=
\text{diag}((\sigma_i^2(x,u))_{i=1,2})
$$

이고, $\sigma_i^2(x,u)$는 posterior variance이다. $\chi_2^2(p_S)$는 degree 2 chi-squared distribution의 quantile이다.

초기 데이터는 downward position 주변의 10개 data point이다. 이후 각 episode가 끝날 때마다 얻은 데이터를 이용해 model belief를 update한다.

논문에서 constraint tightening은 posterior sample을 이용해 실험적으로 선택되었다.

$$
\rho=0.999
$$

$$
\epsilon=0.02
$$

admissible error set은 radius

$$
\gamma=0.02
$$

인 2-norm ball이다.

따라서 confidence map constraint는 다음처럼 구현된다.

$$
\sqrt{
\sigma_{f_j}^2(x,u)\chi_2^2(p_S)
}
\leq
(1-\epsilon_i)0.02,
\qquad
j=1,2
$$

즉, confidence ellipsoid의 모든 semi-axis가 admissible error ball의 radius보다 작아야 한다.

Safety probability는

$$
p_S=0.95
$$

로 선택되었다.

Terminal safe set은 downward position 근처로 잡는다.

$$
S^t
=
\{
(\alpha,\dot{\alpha})
\mid
-30^\circ\leq \alpha\leq 30^\circ,
\ |\dot{\alpha}|\leq 30^\circ/s
\}
$$

terminal safety filter는

$$
\pi_S^t=0
$$

이다.

PSF optimization problem은 planning horizon

$$
N=50
$$

으로 두고, Ipopt와 CasADi를 이용해 real-time으로 풀었다.

---

## 16. Pendulum Results

<br>

논문 Fig. 3은 pendulum swing-up 결과를 보여준다.

<br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/psf_fig3_pendulum_swingup.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Comparison of closed-loop swing-up trajectories during 120 learning episodes under challenging position constraints (dashed lines). Top: Red lines show different learning episodes based on an unsafe learning policy. Middle: Closed-loop learning trajectories using a predictive safety filter with 10 data points (green) and 18000 data points (blue). Bottom: Resulting safe optimal closed-loop performance. The circle radii indicate the relative magnitude of safety ensuring modifications of the learning policy. (For interpretation of the references to color in this figure legend, the reader is referred to the web version of this article.)
</div>
<br>

Top plot은 unsafe learning policy를 직접 적용한 경우이다. 빨간 trajectory들이 여러 learning episode를 나타내며, position constraint를 크게 위반한다.

Middle plot은 PSF를 붙인 경우이다. 초기 10개 data point만 사용하면 초록색 trajectory처럼 매우 cautious한 closed-loop behavior가 나타난다. 이후 첫 번째 실험에서 누적된 18000개 data sample을 이용해 prediction model을 refine하면, 파란색 trajectory처럼 훨씬 덜 보수적인 behavior가 가능해진다.

Bottom plot은 resulting safe optimal closed-loop performance를 보여준다. 여기서 원의 반지름은 safety filter가 learning policy를 수정한 상대적 크기를 나타낸다.

이 예제의 핵심은 다음이다.

> PSF는 초기 데이터가 적을 때는 보수적으로 행동하지만,  
> 안전하게 데이터를 수집하면서 model uncertainty가 줄어들면  
> 더 적극적인 exploration과 swing-up을 허용한다.

즉, 논문이 말하는 safe exploration beyond available data가 이 예제에서 나타난다.

---

## 17. Numerical Example 2: Safe Data-Driven Quadrotor Learning Control

<br>

두 번째 예제는 더 복잡한 quadrotor simulation이다. 논문은 Bullet Physics SDK에서 AscTec Hummingbird drone을 시뮬레이션한다.

Quadrotor에는 two-layer control structure가 사용된다. Inner PD control loop는 body frame에서 desired pitch, roll, vertical acceleration을 받아 motor control signal을 출력한다. 이 inner-controlled system은 hovering equilibrium 주변에서 10 state와 3 input으로 모델링된다.

$$
\tilde{x}\in \mathbb{R}^{10}
$$

$$
u\in \mathbb{R}^3
$$

모델은 다음 형태이다.

$$
\tilde{x}(k+1)=\theta^\top\phi(\tilde{x},u)
$$

State constraints는 ground contact를 피하고 dynamics model validity를 유지하기 위해 다음처럼 주어진다.

$$
z\geq 0.175\,[m]
$$

$$
|\dot{z}|\leq 1\,[m/s]
$$

Input은 normalized되어 있다.

$$
|u_i|\leq 1
$$

---

## 18. Unsafe Learning Policy for Quadrotor

<br>

목표는 landing position에 빠르게 접근하는 것이다.

$$
x_d=3\,[m]
$$

$$
y_d=2\,[m]
$$

$$
z_d=0.2\,[m]
$$

초기 위치는 hovering 상태이다.

$$
z=3.5\,[m],
\qquad
x=y=0
$$

Learning policy는 outer PD controller이다.

$$
\pi_L(\tilde{x};p,d)
=
\begin{bmatrix}
\text{clip}(p_{12}(x_d-x)+d_{12}\dot{x},-1,1)\\
\text{clip}(p_{12}(y_d-y)+d_{12}\dot{y},-1,1)\\
\text{clip}(p_3(z_d-z)+d_3\dot{z},-1,1)
\end{bmatrix}
$$

여기서

$$
\text{clip}(x,c_1,c_2):=\max(\min(x,c_2),c_1)
$$

이다.

학습할 PD gain은 다음 범위에서 선택된다.

$$
p_{12},p_3\in[0,10]
$$

$$
d_{12},d_3\in[-10,0]
$$

Pendulum 예제와 마찬가지로 Bayesian Optimization을 사용한다.

Stage cost는 목표 위치와의 거리와 safety intervention penalty를 포함한다.

$$
\ell(\tilde{x},u)
=
|x_d-x|+|y_d-y|+|z_d-z|
+
100\|\pi_L(\tilde{x})-v_{0|k}^{\ast}\|_2
$$

마지막 항은 safety filter가 learning policy를 수정하는 경우 큰 penalty를 부여한다.

PSF 없이 learning algorithm을 직접 적용하면, 240 learning episode 동안 다수의 ground contact와 vertical velocity violation이 발생한다. 논문은 ground contact를 ground와의 minimum distance가 0.01 m보다 작은 경우로 정의하고, Fig. 4에서 빨간 점으로 표시한다.

---

## 19. Predictive Safety Filter from Data for Quadrotor

<br>

Quadrotor 예제에서도 Bayesian Regression을 사용해 prediction model을 구성한다. Parameter에 Gaussian prior를 두고, observation noise도 Gaussian으로 둔다.

Prediction model 학습에 필요한 데이터는 safe altitude에서 수집한다. 구체적으로 inner control loop에 100개의 random step input을 각각 60초 동안 적용하여 데이터를 생성한다.

Posterior sample을 이용해 constraint tightening은 다음과 같이 선택된다.

$$
\rho=0.999
$$

$$
\epsilon=0.01
$$

maximum allowable error set $E^{\gamma}$는 radius 0.02의 2-norm ball이다.

Planning horizon은

$$
N=20
$$

이다.

Terminal set은 충분히 높은 고도로 선택된다.

$$
z\geq 1.5\,[m]
$$

이 terminal set에서는 suboptimal PD controller gain

$$
p_{12}=p_3=0.5
$$

$$
d_{12}=d_3=-0.5
$$

를 사용해 이후 모든 시간의 constraint satisfaction을 보장할 수 있다고 둔다.

Desired chance constraint satisfaction probability는

$$
p_S=0.9
$$

로 설정된다.

---

## 20. Quadrotor Results

<br>

논문 Fig. 4는 quadrotor learning 결과를 보여준다.

<br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/psf_fig4_quadrotor_experiment.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Quadrotor experiment using the Bullet Physics SDK (Coumans & Bai, 2016–2019). Top-left: Graphical interface showing the optimal safe trajectory (blue line). Top-right: Quadrotor trajectories projected on the x–z plane using an unsafe policy search (red lines) and the safety augmented policy search (blue lines). Bottom: Zoom-in of top-right plot, where red dots represent states with &lt; 0.01 [m] minimum distance to the ground, which we classify as ground contact. (For interpretation of the references to color in this figure legend, the reader is referred to the web version of this article.)
</div>
<br>

Top-left는 Bullet Physics SDK의 graphical interface와 optimal safe trajectory를 보여준다. Top-right는 x-z plane에 projection한 trajectory이다. 빨간 trajectory는 unsafe policy search이고, 파란 trajectory는 safety augmented policy search이다. Bottom plot은 ground 근처를 확대하여 보여준다. 빨간 점은 ground contact로 분류된 상태이다.

결과적으로 PSF는 240 learning episode 전체에서 constraint satisfaction을 가능하게 한다. 또한 최종적으로 얻은 favorable optimal trajectory에서는 objective function에 의해 safety filter가 permanently inactive가 된다.

이 말은 최종 policy가 PSF의 지속적인 수정에 의존하지 않고도 안전한 trajectory를 만든다는 뜻이다. 즉, 학습 초기에 PSF는 위험한 입력을 막고, intervention penalty는 학습기가 PSF의 개입을 줄이는 방향으로 policy를 찾게 만든다.

---

## 21. Discussion

<br>

이 논문의 핵심은 learning controller와 safety filter를 분리하는 것이다. Learning controller는 task performance를 위해 입력을 제안하고, PSF는 그 입력을 실제 시스템에 적용해도 되는지 certify한다.

일반적인 MPC는 performance objective를 포함한 optimal control problem을 매 시간 푼다. 반면 PSF는 task objective를 직접 최적화하지 않는다. PSF는 오직 learning input을 최대한 유지하면서 safe backup trajectory를 찾는다.

이 점에서 PSF는 다음과 같은 장점을 갖는다.

첫째, modular하다. RL algorithm 자체를 바꾸지 않아도 된다.

둘째, minimal intervention 구조이다. Learning input이 safe하면 그대로 통과시키고, unsafe하면 필요한 만큼만 수정한다.

셋째, safe set이나 barrier function을 explicit하게 계산하지 않는다. 대신 safe state-input pair는 finite-horizon backup trajectory feasibility로 implicit하게 표현된다.

넷째, data-driven probabilistic model을 사용할 수 있으며, state-input dependent uncertainty를 confidence map으로 반영한다.

다섯째, 조건부로 all-time chance constraint satisfaction을 보장한다.

<br>

하지만 한계도 있다.

첫째, initial feasibility가 필요하다. 처음 상태에서 PSF problem이 infeasible하면 safety를 보장할 수 없다.

둘째, terminal safe set과 terminal safety filter를 설계해야 한다.

셋째, 매 시간 online optimization problem을 풀어야 한다.

넷째, model confidence map이 실제 model error를 충분히 잘 포함해야 한다. 즉, uncertainty calibration이 중요하다.

다섯째, safety와 exploration 사이에는 trade-off가 있다. $p_S$를 높이거나 $\gamma$를 작게 잡으면 안전성은 높아지지만 exploration은 제한된다.

---

## 22. Conclusion

<br>

이 논문은 safe reinforcement learning 문제를 predictive safety filter 관점에서 다룬다. RL 또는 learning-based controller가 제안한 입력을 실제 시스템에 바로 넣지 않고, predictive safety filter가 현재 상태에서 그 입력이 safe backup trajectory를 갖는지 검사한다.

Nominal case에서는 정확한 모델과 shrinking horizon mechanism을 통해 recursive feasibility를 유지한다. Uncertain case에서는 평균 모델에 대해 backup plan을 계산하고, model error를 고려하기 위해 state/input/terminal constraints를 tighten한다. 또한 set-valued model confidence map을 도입해 모델을 충분히 신뢰할 수 있는 state-input 영역에서만 planning하도록 한다.

논문의 main theorem은 terminal safe set, local tracking 가능성, confidence map의 Lipschitz continuity, initial feasibility 등의 조건 아래에서 다음 safety condition을 보장한다.

$$
Pr
\left(
\forall k:
x(k)\in X,\ u(k)\in U
\right)
\geq p_S
$$

Pendulum swing-up 예제는 초기 데이터가 적은 상황에서도 PSF가 safe exploration을 가능하게 하고, 데이터가 쌓이면 더 덜 보수적인 swing-up을 허용한다는 것을 보여준다. Quadrotor 예제는 더 복잡한 physical simulation에서도 PSF가 unsafe learning을 막고, 최종적으로 safety filter가 거의 개입하지 않는 policy를 얻을 수 있음을 보여준다.

따라서 이 논문은 learning-based control을 constrained nonlinear dynamical system에 적용하기 위한 중요한 safety architecture를 제안한다. 핵심은 다음 한 문장으로 정리할 수 있다.

> 성능 최적화는 learning controller에게 맡기고,  
> 실제 시스템에 적용되는 입력은 predictive safety filter가 안전하게 certify한다.