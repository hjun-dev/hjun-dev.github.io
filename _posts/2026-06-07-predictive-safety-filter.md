---
layout: post
title: "[Paper Review] Predictive Safety Filter for Learning-Based Control"
description: "학습 기반 제어기의 입력을 MPC 기반 안전 필터로 검증하고 수정하는 Predictive Safety Filter 논문 리뷰"
date: 2026-06-07 10:00:00 +0900
tags: [predictive safety filter, safe reinforcement learning, model predictive control, safe learning, constrained control]
categories: [control, reinforcement learning, optimization]
related_posts: True
giscus_comments: true
pretty_table: true
pseudocode: true
toc:
  sidebar: left
---

## Introduction

<br>

이번 포스트에서는 **Predictive Safety Filter for Learning-Based Control of Constrained Nonlinear Dynamical Systems** 논문을 정리한다. 이 논문은 강화학습이나 학습 기반 제어기가 제안한 control input을 실제 시스템에 바로 적용하지 않고, 그 입력이 앞으로도 안전한지 **Predictive Safety Filter (PSF)**를 통해 검사하는 방법을 다룬다. <br>

학습 기반 제어기는 복잡한 비선형 시스템에서 좋은 성능을 보일 수 있다. 하지만 실제 물리 시스템에는 반드시 상태 제약과 입력 제약이 존재한다. 예를 들어 quadrotor라면 최소 고도, 속도 제한, thrust 제한이 있고, pendulum swing-up 문제에서는 각도 제한과 torque 제한이 있다. 이러한 제약은 단순히 cost가 커지는 문제가 아니라, 실제 시스템에서는 사고나 파손으로 이어질 수 있다. <br>

일반적인 강화학습에서는 이런 제약을 reward penalty로 처리하는 경우가 많다. 하지만 penalty는 “위반하면 손해”라는 의미이지, “위반하지 않는다”는 보장을 주지는 않는다. 이 논문은 이 문제를 다음과 같이 접근한다.

> 학습 기반 controller는 성능을 위해 입력을 제안하고,  
> Predictive Safety Filter는 그 입력을 실제 시스템에 넣어도 안전한지 검사한다.

즉, 이 논문은 새로운 RL 알고리즘을 제안하는 논문이라기보다, **임의의 learning controller 위에 붙일 수 있는 MPC 기반 safety layer**를 제안하는 논문이다.

논문의 핵심 아이디어는 다음과 같다.

- 학습 기반 controller가 nominal input $u_L(k)$를 제안함
- PSF는 $u_L(k)$를 그대로 적용해도 미래에 safe backup trajectory가 존재하는지 확인함
- 안전하면 $u_L(k)$를 그대로 통과시킴
- 안전하지 않으면 $u_L(k)$와 가장 가까운 안전 입력으로 수정함
- 모델이 불확실한 경우 constraint tightening과 model confidence map을 사용함
- 조건부로 전체 시간에 대한 probabilistic safety guarantee를 제공함

<br>

이 논문의 가장 중요한 철학은 **성능 최적화와 안전 보장을 분리한다**는 것이다. 강화학습이나 학습 기반 제어기는 성능을 담당하고, PSF는 안전을 담당한다.

<br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/psf_overall_architecture.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Overall architecture of a learning-based controller with a predictive safety filter.<br>
    (from Wabersich and Zeilinger, Predictive Safety Filter for Learning-Based Control)
</div>
<br>

---

## 1. Problem Setting: Learning-Based Control with Constraints

<br>

논문에서 고려하는 시스템은 이산시간 비선형 시스템이다.

$$
x(k+1)=f(x(k),u(k);\theta_R)
$$

여기서 $x(k)$는 시간 $k$에서의 상태이고, $u(k)$는 실제 시스템에 적용되는 입력이다. $\theta_R$은 실제 시스템의 파라미터이다. 이 파라미터는 정확히 알려져 있지 않을 수 있다. 즉, 실제 시스템은 어떤 진짜 파라미터 $\theta_R$에 의해 움직이지만, 우리는 이 값을 완벽하게 모른다.

상태와 입력에는 제약이 존재한다.

$$
x(k)\in X
$$

$$
u(k)\in U
$$

논문에서는 상태 제약과 입력 제약을 polyhedral set 형태로 둔다.

$$
X=\{x\in \mathbb{R}^n \mid A_xx\leq \mathbf{1}\}
$$

$$
U=\{u\in \mathbb{R}^m \mid A_uu\leq \mathbf{1}\}
$$

예를 들어 어떤 상태 $x$가 $-1\leq x\leq 1$을 만족해야 한다면, 이것도 선형 부등식으로 쓸 수 있다.

$$
x\leq 1
$$

$$
-x\leq 1
$$

즉,

$$
\begin{bmatrix}
1\\
-1
\end{bmatrix}x
\leq
\begin{bmatrix}
1\\
1
\end{bmatrix}
$$

와 같은 형태이다.

<br>

학습 기반 controller는 현재 상태를 보고 입력을 제안한다.

$$
u_L(k)=\pi_L(k,x(k))
$$

여기서 아래첨자 $L$은 learning을 의미한다. 즉, $u_L(k)$는 학습 기반 controller가 “이 입력을 넣으면 좋겠다”고 제안한 nominal input이다.

하지만 이 입력은 실제 시스템에 바로 들어가지 않는다. 먼저 safety filter를 거친다.

$$
u(k)=\pi_S(k,x(k),u_L(k))
$$

여기서 $\pi_S$가 predictive safety filter이다. 실제 시스템에 적용되는 입력은 $u_L(k)$가 아니라, safety filter가 출력한 $u(k)$이다.

따라서 실제 시스템은 다음과 같이 움직인다.

$$
x(k+1)=f(x(k),\pi_S(k,x(k),u_L(k));\theta_R)
$$

<br>

학습기 입장에서 보면 자신이 $u_L(k)$를 냈지만, 실제 환경에는 PSF가 수정한 입력 $u(k)$가 들어간다. 따라서 PSF가 붙은 시스템은 다음과 같은 safe system으로 볼 수 있다.

$$
x(k+1)=f_S(k,x(k),u_L(k))
$$

여기서

$$
f_S(k,x,u_L)=f(x,\pi_S(k,x,u_L);\theta_R)
$$

이다.

이 구조의 목표는 명확하다.

> 학습기는 성능을 위해 자유롭게 입력을 제안하게 두고,  
> 실제 시스템에는 항상 안전 인증을 거친 입력만 넣는다.

이렇게 하면 RL 알고리즘이나 Bayesian Optimization, neural policy 같은 학습 알고리즘 자체를 크게 바꾸지 않고도, 실제 시스템에 적용되는 입력은 안전 필터를 통과하게 만들 수 있다.

---

## 2. Safety Requirement

<br>

논문에서 원하는 안전 조건은 다음과 같다.

$$
Pr
\left(
\forall k\in \mathbb{I}_{[0,\bar{N}]}:
x(k)\in X,\ u(k)\in U
\right)
\geq p_S
$$

여기서 $p_S$는 원하는 safety probability이다.

이 식은 단순히 다음 한 step이 안전하다는 의미가 아니다.

$$
x(k+1)\in X
$$

만 확인하는 것이 아니라, 전체 horizon 동안 모든 상태와 입력이 제약을 만족해야 한다.

<br>

이 차이가 중요하다. 예를 들어 quadrotor가 아직 지면 위에 있다고 해서 항상 안전한 것은 아니다. 현재 고도는 충분히 높더라도 수직 속도가 너무 크면 이후 아무리 thrust를 크게 줘도 충돌을 피할 수 없을 수 있다. 이런 경우 현재 상태만 보면 안전해 보이지만, 실제로는 이미 회복 불가능한 방향으로 가고 있을 수 있다.

따라서 safety는 현재 상태만 보는 것이 아니라, **미래 회복 가능성**까지 봐야 한다.

PSF는 바로 이 점을 본다.

> 지금 이 입력을 넣어도, 이후 안전한 backup trajectory가 남아 있는가?

즉, 이 논문에서의 safety는 one-step constraint satisfaction이 아니라, future safety 또는 recoverability에 가까운 개념이다.

---

## 3. Certified Safe Input

<br>

논문에서는 어떤 learning input $u_L(k)$가 **certified safe**하다는 것을 정의한다. 직관적으로 말하면, PSF가 그 입력을 수정하지 않고 그대로 통과시킬 수 있어야 한다.

$$
\pi_S(k,x(k),u_L(k))=u_L(k)
$$

하지만 이것만으로는 부족하다. 그 입력을 적용한 뒤에도 이후 safety filter를 계속 사용했을 때 미래 전체 safety가 유지되어야 한다.

즉, certified safe input은 다음 의미를 가진다.

> 현재 입력을 그대로 적용해도, 이후 모든 시간에 대해 상태와 입력 제약을 만족할 수 있다.

이것은 one-step safety보다 훨씬 강한 개념이다. 단순히 다음 상태가 제약 안에 있는 것이 아니라, **safe backup plan이 존재하는 입력**이어야 한다.

예를 들어 pendulum swing-up 문제에서 어떤 torque 입력을 넣었을 때 다음 각도는 아직 제약 안에 있을 수 있다. 하지만 그 입력 때문에 각속도가 너무 커져서 몇 step 뒤 각도 upper bound를 넘을 수 있다면, 그 입력은 PSF 관점에서 safe certified input이 아니다.

즉, PSF는 다음 질문을 한다.

> 이 입력을 지금 넣어도, 이후 terminal safe set까지 안전하게 돌아갈 수 있는가?

이 질문에 대한 답이 yes이면 입력을 통과시키고, no이면 입력을 수정한다.

---

## 4. Predictive Safety Filter: Main Idea

<br>

PSF는 학습기가 제안한 입력 $u_L(k)$를 받아 다음과 같은 질문을 푼다.

> 현재 상태 $x(k)$에서 시작해서, 첫 입력을 $u_L(k)$와 최대한 가깝게 유지하면서, 상태/입력 제약을 지키고, 마지막에는 terminal safe set으로 들어가는 trajectory가 존재하는가?

이것을 finite-horizon optimization problem으로 표현한다.

예측 상태 sequence는 다음과 같다.

$$
x_{0|k},x_{1|k},\dots,x_{N|k}
$$

예측 입력 sequence는 다음과 같다.

$$
u_{0|k},u_{1|k},\dots,u_{N-1|k}
$$

여기서 $x_{i|k}$는 시간 $k$에서 예측한 $i$ step 뒤의 상태이다. $u_{i|k}$도 마찬가지로 시간 $k$에서 예측한 $i$ step 뒤의 입력이다.

PSF는 첫 입력 $u_{0|k}$가 learning input $u_L(k)$와 최대한 같도록 한다.

$$
\min \|u_L(k)-u_{0|k}\|
$$

subject to

$$
x_{i+1|k}=f(x_{i|k},u_{i|k})
$$

$$
x_{i|k}\in X
$$

$$
u_{i|k}\in U
$$

$$
x_{N|k}\in S^t
$$

$$
x_{0|k}=x(k)
$$

여기서 $S^t$는 terminal safe set이다.

<br>

이 문제의 의미는 다음과 같다.

- feasible solution이 있고 $u_{0|k}=u_L(k)$이면 learning input을 그대로 통과시킨다.
- feasible solution은 있지만 $u_{0|k}\neq u_L(k)$이면 learning input을 최소한으로 수정한다.
- full horizon problem이 infeasible하면 이전에 확보한 backup trajectory의 tail을 사용한다.

즉, PSF는 성능 controller가 아니라 **safety certification and correction layer**이다.

여기서 중요한 점은 목적함수가 task performance가 아니라는 것이다. 일반적인 MPC라면 보통 다음과 같은 cost를 줄인다.

$$
\sum_{i=0}^{N-1}\ell(x_{i|k},u_{i|k})
$$

하지만 PSF는 이런 성능 cost를 직접 최적화하지 않는다. PSF의 목적은 learning input을 최대한 유지하면서 safety certificate를 찾는 것이다.

$$
\min \|u_L(k)-u_{0|k}\|
$$

따라서 PSF는 “좋은 controller”를 설계하는 것이 아니라, “학습기가 낸 입력을 실제 시스템에 넣어도 되는지 검증하는 필터”이다.

---

## 5. Terminal Safe Set

<br>

PSF에서 terminal safe set $S^t$는 매우 중요하다.

Finite horizon 동안만 안전한 trajectory를 찾는 것은 충분하지 않다. 예를 들어 $N$ step까지는 제약을 만족하지만, $N+1$ step에서 반드시 제약을 위반하는 상태에 도달한다면 안전하다고 할 수 없다.

따라서 PSF는 마지막 상태가 terminal safe set에 들어가도록 강제한다.

$$
x_{N|k}\in S^t
$$

여기서 $S^t$는 다음 성질을 가져야 한다.

> $x\in S^t$이면 terminal safety controller를 사용해 이후에도 계속 상태/입력 제약을 만족할 수 있다.

즉, terminal safe set은 목표 set이 아니라 **fallback set**이다.

Pendulum swing-up 예제에서는 목표가 위쪽 위치 $180^\circ$이지만, terminal safe set은 아래쪽 안정 위치 근처이다. Quadrotor 예제에서는 목표가 낮은 landing position이지만, terminal safe set은 충분히 높은 safe altitude이다.

이 차이를 이해하는 것이 중요하다.

> PSF의 backup trajectory는 목표를 향하는 trajectory가 아니라,  
> 필요할 때 안전한 곳으로 돌아갈 수 있는 trajectory이다.

예를 들어 quadrotor가 낮은 고도에 있는 목표 지점으로 접근하는 상황을 생각해보자. 목표는 지면 근처일 수 있다. 하지만 지면 근처는 작은 모델 오차나 속도 오차에도 충돌 위험이 있다. 그래서 PSF의 terminal safe set은 목표점이 아니라, 충분히 높은 고도에 있는 안전한 영역으로 설정될 수 있다.

즉, PSF는 매 순간 다음을 확인한다.

> 지금 학습기가 제안한 입력을 허용해도,  
> 필요하면 다시 안전한 fallback region으로 돌아갈 수 있는가?

이 질문에 yes라고 답할 수 있을 때만 learning input을 그대로 허용한다.

---

## 6. Nominal PSF and Shrinking Horizon

<br>

먼저 모델을 정확히 알고 있다고 가정하자.

시간 $k-1$에서 horizon $N$짜리 backup trajectory를 찾았다고 하자.

$$
x_{0|k-1}^\ast,\dots,x_{N|k-1}^\ast
$$

$$
u_{0|k-1}^\ast,\dots,u_{N-1|k-1}^\ast
$$

실제로 적용한 입력은 첫 번째 입력이다.

$$
u(k-1)=u_{0|k-1}^\ast
$$

모델이 정확하면 실제 다음 상태는 예측 다음 상태와 같다.

$$
x(k)=x_{1|k-1}^\ast
$$

따라서 시간 $k$에서 새 horizon $N$ 문제를 풀지 못하더라도, 이전 trajectory의 tail을 사용할 수 있다.

$$
u_{1|k-1}^\ast,\dots,u_{N-1|k-1}^\ast
$$

이것은 horizon $N-1$짜리 feasible backup plan이 된다.

<br>

이 과정을 반복하면 horizon이 줄어든다.

$$
N,\ N-1,\ N-2,\dots,0
$$

새로운 full horizon backup plan을 찾지 못하더라도, 이전에 확보한 backup plan의 tail을 따라가면 결국 terminal safe set에 도달한다.

이것이 **shrinking horizon**이다.

<br>

```text
Time k-1:
[ u0, u1, u2, ..., uN-1 ]  → terminal safe set

Apply u0

Time k:
[ u1, u2, ..., uN-1 ]      → terminal safe set

If new full horizon plan is unavailable,
follow the remaining backup plan.

<br>

Nominal PSF의 안전성은 이 shrinking horizon과 recursive feasibility에 기반한다.

<br> <div class="row mt-3 justify-content-sm-center"> <div class="col-sm-8 mt-3 mt-md-0"> {% include figure.liquid loading="eager" path="assets/img/blog_img/psf_nominal_backup_trajectory.png" class="img-fluid rounded z-depth-1" zoomable=true %} </div> </div> <div class="caption"> Nominal predictive safety filter and backup trajectory.<br> (from Wabersich and Zeilinger, Predictive Safety Filter for Learning-Based Control) </div> <br>

이 그림은 논문에서 PSF의 기본 구조를 보여주는 중요한 그림이다. 현재 입력을 허용하려면 terminal safe set으로 이어지는 backup trajectory가 존재해야 한다. 새 backup trajectory를 찾지 못하면 이전 backup trajectory의 남은 부분을 따라가며 terminal safe set으로 이동한다.

7. Model Uncertainty and Constraint Tightening
<br>

현실에서는 모델이 정확하지 않다. 실제 시스템은 다음과 같지만,

x(k+1)=f(x(k),u(k);θ
R
	

)

우리는 평균 모델 또는 nominal model을 사용한다.

f(x,u;
θ
ˉ
)

따라서 model error가 존재한다.

e(k,θ
R
	

)=f(x(k),u(k);θ
R
	

)−f(x(k),u(k);
θ
ˉ
)

이 경우 nominal PSF의 핵심 등식이 깨진다.

x(k)

=μ
1∣k−1
∗
	


즉, 실제 상태는 이전에 예측한 nominal trajectory 위에 정확히 놓이지 않는다.

<br>

이를 해결하기 위해 논문은 평균 모델 기준 trajectory를 계획하고, 실제 trajectory가 그 주변 tube 안에 있을 것으로 본다.

Nominal predicted state는 $\mu$로 쓴다.

μ
i+1∣k
	

=f(μ
i∣k
	

,v
i∣k
	

;
θ
ˉ
)

그리고 nominal trajectory가 원래 제약 경계까지 가지 않도록 제약을 tighten한다.

상태 제약은 다음처럼 줄어든다.

X
ˉ
i
	

={x∣A
x
	

x≤(1−ϵ
i
	

)1}

입력 제약도 마찬가지이다.

U
ˉ
i
	

={u∣A
u
	

u≤(1−ϵ
i
	

)1}

terminal set도 줄인다.

S
ˉ
N
f
	

={x∣a
S
	

(x)≤(1−ϵ
N
	

)1}
<br>

즉, uncertain PSF에서는 nominal trajectory가 원래 constraint가 아니라 tightened constraint 안에 있어야 한다.

μ
i∣k
	

∈
X
ˉ
i
	

v
i∣k
	

∈
U
ˉ
i
	


이렇게 하면 실제 trajectory가 model error 때문에 nominal trajectory에서 조금 벗어나도 원래 제약 $X$, $U$ 안에 남을 수 있다.

<br> <div class="row mt-3 justify-content-sm-center"> <div class="col-sm-8 mt-3 mt-md-0"> {% include figure.liquid loading="eager" path="assets/img/blog_img/psf_uncertainty_tube_tightening.png" class="img-fluid rounded z-depth-1" zoomable=true %} </div> </div> <div class="caption"> Uncertainty tube and tightened constraints in the predictive safety filter.<br> (from Wabersich and Zeilinger, Predictive Safety Filter for Learning-Based Control) </div> <br>

이 그림은 nominal trajectory와 실제 trajectory의 차이를 직관적으로 보여준다. PSF는 평균 모델 기준의 nominal trajectory를 계획하지만, 실제 시스템은 모델 오차 때문에 그 주변 tube 안에서 움직일 수 있다. 따라서 nominal trajectory는 원래 constraint boundary가 아니라 tightened constraint 안쪽에 있어야 한다.

8. Tightening Sequence
<br>

tightening factor는 다음과 같이 정의된다.

ϵ
0
	

=0
ϵ
i+1
	

=ϵ
i
	

+
ρ
i
	

ϵ

따라서

ϵ
i
	

=ϵ
1−
ρ
	

1−
ρ
	

i
	


여기서 $\rho$는 actual state가 nominal trajectory를 얼마나 빨리 따라잡을 수 있는지를 나타내는 contraction rate이다.

$\rho\approx 0$이면 tracking error가 빠르게 줄어든다.
$\rho\approx 1$이면 tracking error가 오래 남는다.

$\epsilon$은 기본 tightening scale이다.

$\epsilon$이 크면 더 보수적이다.
$\epsilon$이 작으면 덜 보수적이지만 model error에 취약하다.
<br>

이 tightening sequence는 단순히 임의로 만든 것이 아니다. 시간 $k$의 backup plan을 시간 $k+1$에서 한 칸 shift할 때 생기는 deviation을 흡수하기 위해 설계된다.

즉,

ϵ
i+1
	

−ϵ
i
	


는 shifted backup trajectory와 실제 candidate trajectory 사이의 차이를 흡수하는 margin이다.

조금 더 직관적으로 보면 다음과 같다. 시간 $k$에서 $i+1$ step 뒤의 nominal state는 더 멀리 있는 미래 상태이므로 더 강하게 tightened된 set 안에 있어야 한다. 시간 $k+1$이 되면 그 상태는 이제 $i$ step 뒤의 상태가 된다. 이때 horizon index가 하나 줄어들면서 constraint tightening도 조금 완화된다. 그 완화된 양이 바로 model error와 tracking deviation을 흡수하는 여유가 된다.

9. Model Confidence Map
<br>

모델 불확실성을 전체 영역에서 하나의 큰 bound로 잡으면 지나치게 보수적이다.

예를 들어 데이터가 많은 영역에서는 model error가 작고, 데이터가 거의 없는 영역에서는 model error가 클 수 있다. 그런데 전체 상태-입력 공간에 대해 하나의 큰 error bound를 쓰면, 데이터가 충분히 많은 영역에서도 불필요하게 큰 safety margin을 둬야 한다.

이를 반영하기 위해 논문은 state-input dependent uncertainty를 사용한다.

E
p
S
	

	

(x,u)

이것은 상태-입력 쌍 $(x,u)$에서 가능한 model error들의 집합이다. Bayesian regression이나 Gaussian Process를 사용하면 posterior variance를 통해 이런 confidence set을 만들 수 있다.

PSF는 backup trajectory가 모델을 충분히 믿을 수 있는 영역만 지나가도록 다음 조건을 둔다.

E
p
S
	

	

(μ
i∣k
	

,v
i∣k
	

)⊆
E
ˉ
i
γ
	


여기서 $\bar{E}_i^\gamma$는 허용 가능한 작은 error set이다.

E
ˉ
i
γ
	

={e∣a
E
	

(e)≤γ(1−ϵ
i
	

)1}
<br>

이 조건의 의미는 다음이다.

해당 예측 상태-입력 지점에서 가능한 model error가
우리가 감당할 수 있는 작은 error set 안에 들어와야 한다.

즉, PSF는 모델이 불확실한 영역에서는 backup trajectory를 만들지 못한다.

<br>

이 구조 덕분에 데이터가 쌓일수록 posterior uncertainty가 줄어들고, confidence set이 작아지며, PSF가 허용하는 영역이 넓어진다. 이것이 논문에서 말하는 safe exploration의 핵심이다.

초기에는 데이터가 적기 때문에 PSF가 매우 보수적으로 행동한다. 하지만 안전하게 rollout을 반복하면서 데이터가 쌓이면 모델의 posterior variance가 줄어든다. 그러면 confidence set $E_{p_S}(x,u)$가 작아지고, 더 많은 상태-입력 쌍이 다음 조건을 만족하게 된다.

E
p
S
	

	

(x,u)⊆
E
ˉ
i
γ
	


결과적으로 PSF가 허용하는 backup trajectory의 범위가 넓어진다.

10. Final PSF Optimization Problem
<br>

불확실한 모델을 고려한 최종 PSF 문제는 다음 구조를 가진다.

{v
i
	

}
min
	

∥u
L
	

(k)−v
0∣k
	

∥

subject to

μ
i+1∣k
	

=f(μ
i∣k
	

,v
i∣k
	

;
θ
ˉ
)
μ
i∣k
	

∈
X
ˉ
i
	

v
i∣k
	

∈
U
ˉ
i
	

E
p
S
	

	

(μ
i∣k
	

,v
i∣k
	

)⊆
E
ˉ
i
γ
	

μ
N∣k
	

∈
S
ˉ
N
f
	

μ
0∣k
	

=x(k)
<br>

각 항의 역할은 다음과 같다.

Component	Role
Objective $|u_L-v_0|$	learning input을 최대한 유지
Nominal dynamics	평균 모델 기준 backup trajectory 생성
Tightened state constraint	실제 상태가 원래 $X$를 위반하지 않도록 margin 확보
Tightened input constraint	실제 입력이 원래 $U$를 위반하지 않도록 margin 확보
Confidence map constraint	모델이 충분히 정확한 영역에서만 planning
Terminal set constraint	finite horizon 이후의 safety 보장
Initial condition	현재 실제 상태에서 출발
<br>

이 문제의 목적함수는 performance cost가 아니다. PSF는 task objective를 최적화하는 것이 아니라, learning input을 최소 수정하면서 safety certificate를 찾는 문제를 푼다.

즉, PSF가 푸는 문제는 다음과 같이 요약할 수 있다.

현재 learning input을 최대한 유지하되,
평균 모델 기준으로 tightened constraints를 만족하고,
모델 uncertainty가 충분히 작은 영역을 지나며,
마지막에는 terminal safe set에 도달하는 backup trajectory를 찾아라.

여기까지가 PSF의 핵심 formulation이다.

---

## 11. Safety Guarantee

<br>

논문의 핵심 정리는 PSF가 어떤 조건에서 안전을 보장하는지 설명한다. 지금까지의 내용을 정리하면 PSF는 다음 요소들을 사용한다.

- terminal safe set
- backup trajectory
- shrinking horizon
- constraint tightening
- model confidence map
- local tracking assumption

이제 중요한 질문은 다음이다.

> 이 구조를 사용하면 정말로 전체 시간 동안 상태와 입력 제약을 만족한다고 말할 수 있는가?

논문의 Theorem 4.6은 이 질문에 대한 답이다. 정리의 핵심은 다음과 같다.

> 초기 상태에서 PSF 문제가 feasible하고, terminal safe set이 존재하며, nominal trajectory 주변에서 local tracking이 가능하고, model confidence map이 충분히 부드럽게 변하면, 충분히 작은 $\gamma$를 선택했을 때 PSF는 확률 $p_S$ 수준에서 모든 시간의 상태/입력 제약 만족을 보장한다.

즉,

$$
Pr
\left(
\forall k:
x(k)\in X,\ u(k)\in U
\right)
\geq p_S
$$

를 보장한다.

<br>

여기서 이 정리는 “항상 무조건 안전하다”는 뜻이 아니다. 몇 가지 중요한 조건이 필요하다.

### 11.1 Initial Feasibility

<br>

처음 상태 $x(0)$에서 PSF optimization problem이 feasible해야 한다.

즉, 처음부터 terminal safe set으로 갈 수 있는 안전한 backup trajectory가 있어야 한다.

만약 시스템이 이미 회복 불가능한 상태에서 시작한다면 PSF도 안전을 보장할 수 없다. 예를 들어 quadrotor가 지면 바로 위에서 큰 하강 속도를 가지고 있고, 최대 thrust를 써도 충돌을 피할 수 없다면 어떤 safety filter도 물리적으로 문제를 해결할 수 없다.

따라서 PSF는 모든 상태를 안전하게 만드는 장치가 아니라, **recoverable state에서 시작했을 때 safety를 유지하는 장치**이다.

### 11.2 Terminal Safe Set

<br>

어떤 terminal safe set $S^t$와 terminal safety controller가 존재해야 한다.

$$
x\in S^t
\Rightarrow
\text{future safety}
$$

즉, 시스템이 terminal safe set에 들어가면 이후에는 terminal safety controller를 사용해 계속 상태와 입력 제약을 만족할 수 있어야 한다.

이 조건이 필요한 이유는 PSF가 finite horizon 문제를 풀기 때문이다. PSF는 $N$ step 뒤까지의 backup trajectory만 직접 계획한다. 따라서 $N$ step 뒤 상태가 단순히 $X$ 안에 있는 것만으로는 부족하다. 그 이후에도 안전하게 운용될 수 있는 영역에 들어가야 한다.

그래서 terminal condition은 다음과 같이 둔다.

$$
\mu_{N|k}\in \bar{S}_N^f
$$

여기서 $\bar{S}_N^f$는 model uncertainty를 고려해 tightened된 terminal safe set이다.

### 11.3 Local Tracking

<br>

불확실한 모델에서는 실제 상태가 nominal trajectory에서 벗어날 수 있다.

$$
x(k)\neq \mu_{i|k}
$$

따라서 이전 backup trajectory의 tail을 그대로 사용할 수 없다. 대신 실제 상태가 nominal trajectory에서 조금 벗어나더라도, 적절한 local feedback으로 nominal trajectory를 다시 따라갈 수 있어야 한다.

논문은 이를 contraction condition으로 표현한다.

$$
V(\text{next error})\leq \rho V(\text{current error})
$$

여기서 $V$는 실제 상태와 nominal state 사이의 차이를 측정하는 함수이다. 직관적으로는 다음과 비슷하다고 보면 된다.

$$
V(x,\mu)\approx \|x-\mu\|^2
$$

$\rho$는 contraction rate이다.

$$
0<\rho<1
$$

즉, 실제 상태와 nominal trajectory 사이의 error가 local tracking policy에 의해 줄어들어야 한다.

### 11.4 Lipschitz Confidence Map

<br>

model confidence map도 너무 급격히 변하면 안 된다.

$$
E_{p_S}(x,u)
$$

는 상태-입력 쌍 $(x,u)$에서 가능한 model error set이다. 이 map이 급격히 변한다면, 시간 $k$에서 confidence constraint를 만족하던 trajectory가 시간 $k+1$에서 약간 shift되었을 때 갑자기 confidence constraint를 위반할 수 있다.

따라서 논문은 Hausdorff distance 기준 Lipschitz continuity를 가정한다.

$$
d_H(E_{p_S}(x,u),E_{p_S}(x',u'))
\leq
L\|(x,u)-(x',u')\|
$$

여기서 $d_H$는 두 집합 사이의 Hausdorff distance이다.

이 조건은 다음 의미를 가진다.

> 상태와 입력이 조금 변하면, model uncertainty set도 조금만 변해야 한다.

이 조건이 있어야 이전 backup plan의 tail을 불확실한 모델에서도 robust하게 사용할 수 있다.

---

## 12. Proof Idea

<br>

Theorem의 증명은 복잡해 보이지만, 핵심은 recursive feasibility이다.

먼저 시간 $k$에서 feasible backup plan이 있다고 하자.

$$
\{\mu_{i|k}^\ast,v_{i|k}^\ast\}_{i=0}^{N}
$$

즉, 이 plan은 다음을 만족한다.

$$
\mu_{0|k}^\ast=x(k)
$$

$$
\mu_{i+1|k}^\ast=f(\mu_{i|k}^\ast,v_{i|k}^\ast;\bar{\theta})
$$

$$
\mu_{i|k}^\ast\in \bar{X}_i
$$

$$
v_{i|k}^\ast\in \bar{U}_i
$$

$$
E_{p_S}(\mu_{i|k}^\ast,v_{i|k}^\ast)\subseteq \bar{E}_i^\gamma
$$

$$
\mu_{N|k}^\ast\in \bar{S}_N^f
$$

이제 첫 입력을 실제 시스템에 적용한다.

$$
u(k)=v_{0|k}^\ast
$$

실제 다음 상태는 평균 모델의 예측과 정확히 같지 않을 수 있다. model error 때문에 다음과 같이 된다.

$$
x(k+1)=\mu_{1|k}^\ast+e(k,\theta_R)
$$

model error가 confidence set 안에 있으면, 이 차이는 충분히 작다.

$$
e(k,\theta_R)\in E^\gamma
$$

따라서 실제 상태 $x(k+1)$는 old nominal next state $\mu_{1|k}^\ast$ 근처에 있다.

<br>

이제 시간 $k+1$에서 old trajectory의 tail을 그대로 쓰는 대신, local tracking policy로 old tail을 추적하는 candidate plan을 만든다.

$$
\tilde{v}_{i|k+1}
=
\pi(\tilde{\mu}_{i|k+1},\mu_{i+1|k}^\ast,v_{i+1|k}^\ast)
$$

여기서 $\pi$는 Assumption 4.3에서 존재한다고 가정한 local tracking policy이다. 이 policy는 실제 구현에서 반드시 직접 쓰는 것이 아니라, feasible candidate plan이 존재함을 보이기 위한 증명 도구이다.

이 candidate trajectory는 old shifted trajectory 근처에 머문다.

$$
\|\tilde{\mu}_{i|k+1}-\mu_{i+1|k}^\ast\|
\leq
C\rho^{i/2}\gamma
$$

즉, model error가 작고 local tracking이 가능하면, 시간 $k+1$에서 만든 candidate trajectory는 시간 $k$에서 계획한 backup trajectory의 tail 근처에 머문다.

<br>

이제 이 deviation이 tightening margin보다 작도록 $\gamma$를 충분히 작게 고르면 state/input/terminal constraints가 유지된다.

예를 들어 old state가 다음 tightened set 안에 있었다고 하자.

$$
\mu_{i+1|k}^\ast\in \bar{X}_{i+1}
$$

시간이 한 step 지나면 이 상태는 새 candidate trajectory의 $i$ step 뒤 상태와 비교된다.

$$
\tilde{\mu}_{i|k+1}
$$

두 상태가 충분히 가까우면, 그리고 tightening margin이 충분하면 다음을 보일 수 있다.

$$
\tilde{\mu}_{i|k+1}\in \bar{X}_i
$$

input constraint와 terminal constraint도 같은 방식으로 보인다.

<br>

confidence constraint는 model confidence map의 Lipschitz continuity로 보인다. candidate pair가 old pair에서 조금만 변했기 때문에, confidence set도 조금만 변한다.

$$
E_{p_S}(\tilde{\mu}_{i|k+1},\tilde{v}_{i|k+1})
\approx
E_{p_S}(\mu_{i+1|k}^\ast,v_{i+1|k}^\ast)
$$

따라서 $\gamma$와 confidence map의 Lipschitz constant가 적절히 작으면 다음이 유지된다.

$$
E_{p_S}(\tilde{\mu}_{i|k+1},\tilde{v}_{i|k+1})
\subseteq
\bar{E}_i^\gamma
$$

결국 시간 $k+1$에서 horizon $N-1$짜리 feasible plan이 존재한다.

이 과정을 반복하면 terminal safe set에 도달하고, 그 이후는 terminal safety controller가 안전을 보장한다.

<br>

따라서 model error가 confidence map 안에 들어가는 사건 아래에서는 deterministic safety가 성립한다. 그 사건의 확률이 $p_S$ 이상이므로 전체적으로 chance safety가 성립한다.

$$
Pr
\left(
\forall k:
x(k)\in X,\ u(k)\in U
\right)
\geq p_S
$$

---

## 13. Design Parameters

<br>

PSF를 실제로 설계할 때 중요한 파라미터는 네 개이다.

$$
\rho,\quad \epsilon,\quad \gamma,\quad p_S
$$

각각의 의미는 다음과 같다.

| Parameter | Meaning | Larger Value Means |
| --- | --- | --- |
| $\rho$ | tracking error contraction rate | slower tracking assumption, more conservative |
| $\epsilon$ | constraint tightening scale | larger safety margin, smaller feasible region |
| $\gamma$ | allowable model error size | larger uncertainty allowed, less conservative |
| $p_S$ | desired safety probability | larger confidence set, more conservative |

<br>

### 13.1 $\rho$

<br>

$\rho$는 실제 상태가 nominal trajectory에서 벗어났을 때 얼마나 빠르게 다시 따라잡을 수 있는지를 나타낸다.

$$
0<\rho<1
$$

$\rho$가 작으면 시스템이 nominal trajectory를 빠르게 따라잡을 수 있다고 보는 것이다. 즉, model error가 생겨도 그 영향이 빠르게 줄어든다고 가정한다.

반대로 $\rho$가 1에 가까우면 tracking error가 오래 남는다고 보는 것이다. 이 경우 미래 step으로 갈수록 더 큰 safety margin이 필요하므로 더 보수적이다.

논문에서는 보수적으로 시작할 때 $\rho\approx 1$을 사용할 수 있다고 설명한다.

### 13.2 $\epsilon$

<br>

$\epsilon$은 constraint tightening의 기본 크기이다.

$\epsilon$이 크면 tightened set이 작아진다.

$$
\bar{X}_i
=
\{x\mid A_xx\leq (1-\epsilon_i)\mathbf{1}\}
$$

따라서 nominal trajectory는 constraint boundary에서 더 멀리 떨어져야 한다. 안전 margin은 커지지만, feasible region은 작아진다.

반대로 $\epsilon$이 작으면 PSF가 덜 보수적이지만, model error를 흡수할 margin이 줄어든다.

### 13.3 $\gamma$

<br>

$\gamma$는 허용 가능한 model error의 크기이다.

$$
\bar{E}_i^\gamma
=
\{e\mid a_E(e)\leq \gamma(1-\epsilon_i)\mathbf{1}\}
$$

$\gamma$가 작으면 모델 uncertainty가 아주 작은 영역에서만 backup trajectory를 만들 수 있다. 따라서 안전하지만 보수적이다.

$\gamma$가 크면 더 넓은 영역에서 backup trajectory를 만들 수 있지만, model error가 커질 수 있으므로 safety guarantee가 어려워진다.

### 13.4 $p_S$

<br>

$p_S$는 원하는 safety probability이다.

$$
Pr
\left(
\forall k:
x(k)\in X,\ u(k)\in U
\right)
\geq p_S
$$

$p_S$가 크면 confidence set $E_{p_S}(x,u)$도 커진다. 예를 들어 99% confidence set은 90% confidence set보다 크다. 따라서 $p_S$가 클수록 PSF는 더 보수적이다.

<br>

안전성을 더 보수적으로 잡으려면 대략 다음 방향이 된다.

$$
\rho\uparrow,\quad
\epsilon\uparrow,\quad
\gamma\downarrow,\quad
p_S\uparrow
$$

반대로 exploration을 더 허용하려면 다음 방향이 된다.

$$
\rho\downarrow,\quad
\epsilon\downarrow,\quad
\gamma\uparrow,\quad
p_S\downarrow
$$

<br>

논문에서는 보수적인 초기값으로 다음과 같은 선택을 제안한다.

$$
\rho\approx 1
$$

$$
\epsilon\approx \frac{1}{N}
$$

$$
\gamma\ \text{small}
$$

이후 offline verification이나 simulation을 통해 파라미터를 조정할 수 있다.

---

## 14. Pendulum Swing-Up Example

<br>

첫 번째 예제는 pendulum swing-up이다.

상태는 각도와 각속도이다.

$$
x=
\begin{bmatrix}
\alpha\\
\dot{\alpha}
\end{bmatrix}
$$

입력은 torque이다.

$$
u
$$

목표는 pendulum을 아래쪽 위치에서 위쪽 위치로 swing-up하는 것이다.

$$
\alpha=180^\circ
$$

하지만 각도 제약이 존재한다.

$$
-90^\circ\leq \alpha \leq 190^\circ
$$

즉, 위쪽 목표를 지나쳐 과도하게 overshoot하면 constraint violation이다.

<br>

학습기는 bang-bang open-loop input을 사용한다.

$$
\pi_L(k;k_{s1},k_{s2})
=
\begin{cases}
-0.7, & k\leq k_{s1}\\
0.7, & k_{s1}\leq k\leq k_{s2}\\
0, & \text{otherwise}
\end{cases}
$$

학습해야 할 파라미터는 switching time $k_{s1}$, $k_{s2}$이다. 이 파라미터는 Bayesian Optimization으로 찾는다.

<br>

PSF가 없으면 학습기가 공격적인 torque sequence를 시도하면서 각도 제약을 위반한다. 반면 PSF를 붙이면 learning input을 검사하고 필요할 때 수정하여 constraint violation을 막는다.

### 14.1 Data-Driven Model

<br>

Pendulum dynamics는 Bayesian linear regression으로 학습한다.

모델은 feature에 대해 linear하다.

$$
f(x,u)=\theta^\top \phi(x,u)
$$

feature는 다음과 같다.

$$
\phi(x,u)
=
[x_1,\ x_2,\ \sin(x_1),\ u]^\top
$$

이 feature 선택은 pendulum dynamics 구조를 반영한다. Pendulum dynamics에는 $\sin(\alpha)$ 항이 들어가기 때문에, $\sin(x_1)$를 feature에 포함하면 nonlinear system을 feature space에서는 linear-in-parameter model로 표현할 수 있다.

posterior variance를 이용해 confidence ellipsoid를 만든다.

$$
E_{p_S}(x,u)
=
\{e\mid e^\top\Sigma^{-1}(x,u)e\leq \chi_2^2(p_S)\}
$$

PSF는 이 ellipsoid가 허용 가능한 작은 error ball 안에 들어가는 지점만 backup trajectory로 허용한다.

<br>

초기에는 아래쪽 안정 위치 근처의 데이터 10개만 주어진다. 따라서 모델은 위쪽 영역을 잘 모른다. PSF는 처음에는 보수적으로 행동한다.

하지만 safe rollout을 통해 데이터가 쌓이면 posterior uncertainty가 줄어든다. 논문에서는 18000개 데이터가 쌓인 뒤 훨씬 덜 보수적인 swing-up이 가능해진다.

<br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/psf_pendulum_safe_exploration.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Safe exploration in the pendulum swing-up task.<br>
    (from Wabersich and Zeilinger, Predictive Safety Filter for Learning-Based Control)
</div>
<br>

이 예제의 핵심은 다음이다.

> PSF는 데이터가 없는 영역을 무조건 막는 것이 아니라,  
> model uncertainty가 허용 가능한 수준인 방향으로만 안전하게 exploration을 확장한다.

<br>

초기 데이터가 적을 때는 PSF가 많이 개입한다. 이는 학습기가 제안한 입력이 즉시 constraint를 위반하기 때문만은 아니다. 모델이 해당 영역을 충분히 확신하지 못하거나, terminal safe set으로 돌아가는 backup trajectory가 없기 때문일 수도 있다.

데이터가 쌓이면 posterior uncertainty가 줄고, PSF가 허용하는 영역이 넓어진다. 따라서 학습기는 점점 더 적극적인 swing-up trajectory를 시도할 수 있다.

---

## 15. Quadrotor Example

<br>

두 번째 예제는 quadrotor learning control이다.

목표는 초기 hovering 상태에서 낮은 landing position으로 빠르게 접근하는 것이다.

초기 위치는 다음과 같다.

$$
(x,y,z)=(0,0,3.5)
$$

목표 위치는 다음과 같다.

$$
(x_d,y_d,z_d)=(3,2,0.2)
$$

안전 제약은 주로 ground contact를 피하기 위한 것이다.

$$
z\geq 0.175
$$

또한 수직 속도 제한이 있다.

$$
|\dot{z}|\leq 1
$$

입력도 제한된다.

$$
|u_i|\leq 1
$$

<br>

학습기는 outer PD controller의 gain을 Bayesian Optimization으로 찾는다.

$$
\pi_L(\tilde{x};p,d)
$$

PSF가 없으면 학습 중 aggressive gain이 시도되면서 ground contact와 velocity constraint violation이 발생한다.

PSF를 붙이면 240 learning episodes 동안 constraint satisfaction을 유지한다.

<br>

중요한 점은 terminal safe set이다. Quadrotor의 목표는 낮은 고도 $z_d=0.2$이지만, terminal safe set은 높은 고도 영역이다.

$$
z\geq 1.5
$$

즉, PSF는 매 순간 다음을 확인한다.

> 지금 학습기가 제안한 입력을 허용해도,  
> 필요하면 다시 높은 safe altitude로 회복할 수 있는가?

<br>

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/psf_quadrotor_safe_learning.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Quadrotor learning with and without predictive safety filter.<br>
    (from Wabersich and Zeilinger, Predictive Safety Filter for Learning-Based Control)
</div>
<br>

이 예제는 PSF가 작은 toy problem뿐 아니라 더 복잡한 physical simulation에서도 unsafe learning을 막을 수 있음을 보여준다.

<br>

Pendulum 예제와 quadrotor 예제는 역할이 조금 다르다. Pendulum 예제는 적은 초기 데이터에서 safe exploration이 어떻게 가능한지를 보여준다. Quadrotor 예제는 더 큰 시스템에서도 PSF가 실제 학습 과정에서 constraint violation을 막을 수 있음을 보여준다.

---

## 16. Relation to CBF and MPC

<br>

PSF는 CBF, MPC와 밀접하게 관련되어 있다.

### 16.1 CBF와 비교

<br>

Control Barrier Function은 보통 safe set을 다음처럼 명시적으로 정의한다.

$$
\mathcal{C}=\{x\mid h(x)\geq 0\}
$$

그리고 입력은 barrier condition을 만족하도록 QP로 수정한다.

$$
\min_u \|u-u_L\|^2
$$

subject to

$$
\dot{h}(x,u)\geq -\alpha(h(x))
$$

PSF도 learning input을 최소 수정한다는 점에서는 비슷하다.

하지만 차이는 safe set 표현 방식이다.

| Method | Safety Representation |
| --- | --- |
| CBF | explicit barrier function $h(x)$ |
| PSF | implicit backup trajectory feasibility |

<br>

CBF는 계산이 빠른 경우가 많지만, 좋은 barrier function을 설계하기 어렵다. 특히 복잡한 nonlinear system에서는 진짜 recoverable safe set을 나타내는 barrier function을 찾는 것이 쉽지 않다.

PSF는 barrier function을 직접 만들지 않는다. 대신 현재 상태와 입력에서 terminal safe set으로 가는 backup trajectory가 존재하는지를 optimization으로 확인한다.

즉, PSF에서 safe action set은 다음처럼 암시적으로 정의된다.

$$
\mathcal{U}_{safe}(x)
=
\{u_L\mid \text{PSF problem is feasible with }v_0=u_L\}
$$

### 16.2 MPC와 비교

<br>

MPC는 일반적으로 성능 cost를 직접 최적화한다.

$$
\min_{u_0,\dots,u_{N-1}}
\sum_i \ell(x_i,u_i)
$$

subject to dynamics and constraints.

반면 PSF는 성능 cost를 최적화하지 않는다.

$$
\min \|u_L-v_0\|
$$

즉, MPC를 controller로 쓰는 것이 아니라 safety filter로 사용한다.

| Method | Role |
| --- | --- |
| Learning-based MPC | MPC가 controller 역할 |
| PSF | MPC가 safety filter 역할 |
| RL + PSF | RL이 성능 담당, PSF가 안전 담당 |

<br>

이 분리 덕분에 PSF는 임의의 RL policy, Bayesian Optimization policy, neural controller 등에 붙일 수 있다.

---

## 17. Strengths and Limitations

<br>

이 논문의 장점은 명확하다.

1. **Modular safety layer**
   - RL 알고리즘 자체를 바꾸지 않아도 된다.
   - 학습기가 어떤 방식으로 입력을 만들든, PSF는 그 입력을 받아 safety certification을 수행한다.

2. **Minimal intervention**
   - 안전하면 learning input을 그대로 통과시킨다.
   - 안전하지 않을 때만 learning input을 최소한으로 수정한다.

3. **Future recoverability**
   - one-step safety가 아니라 backup trajectory feasibility를 본다.
   - 따라서 현재는 제약 안에 있어도 미래에 회복 불가능한 입력은 막을 수 있다.

4. **Data-driven uncertainty**
   - state-input dependent confidence map을 사용한다.
   - 데이터가 많은 영역에서는 덜 보수적이고, 데이터가 적은 영역에서는 더 보수적이다.

5. **Probabilistic safety guarantee**
   - 조건부로 전체 시간에 대한 chance safety를 제공한다.

<br>

하지만 한계도 분명하다.

1. **Initial feasibility가 필요하다.**
   - 처음 상태가 recoverable set 밖이면 PSF도 안전을 보장할 수 없다.

2. **Terminal safe set 설계가 필요하다.**
   - 복잡한 시스템에서는 $S^t$를 설계하는 것이 어렵다.

3. **Online optimization이 필요하다.**
   - 매 시점 nonlinear optimization을 풀어야 할 수 있다.
   - 실제 시스템에서는 solver 속도와 reliability가 중요하다.

4. **Model confidence calibration에 의존한다.**
   - posterior uncertainty가 overconfident하면 safety guarantee가 약해진다.

5. **보수성과 exploration 사이 trade-off가 있다.**
   - $\rho,\epsilon,\gamma,p_S$ 선택에 따라 학습이 막히거나 안전 margin이 부족할 수 있다.

6. **성능 최적성은 보장하지 않는다.**
   - PSF는 안전 필터이지 optimal controller가 아니다.
   - 성능은 learning controller가 만들어야 한다.

이 한계들은 PSF가 무의미하다는 뜻이 아니다. 오히려 PSF를 실제로 적용할 때 무엇을 조심해야 하는지를 알려준다. PSF는 안전을 위한 매우 강력한 구조지만, terminal set, uncertainty calibration, online optimization이라는 현실적인 설계 문제가 남아 있다.

---

## 18. PSF Intervention as Learning Signal

<br>

이 논문을 단순히 safe control 관점에서만 볼 필요는 없다. PSF가 개입했다는 사실은 학습 관점에서도 중요한 정보를 제공한다.

PSF가 개입했다는 것은 다음을 의미한다.

$$
u(k)\neq u_L(k)
$$

개입량은 다음과 같이 쓸 수 있다.

$$
\Delta u(k)=u(k)-u_L(k)
$$

이 값은 단순한 noise가 아니다. PSF 관점에서는 다음 의미를 가진다.

> 현재 상태에서 learner가 제안한 입력은 safe backup certificate를 통과하지 못했다.

즉,

$$
u_L(k)\notin \mathcal{U}_{safe}(x(k))
$$

라고 볼 수 있다.

여기서

$$
\mathcal{U}_{safe}(x)
=
\{u_L\mid \text{PSF problem is feasible with }v_0=u_L\}
$$

이다.

<br>

따라서 PSF intervention은 다음과 같은 정보를 담고 있다.

- 상태 제약 위반 가능성
- 입력 제약 위반 가능성
- terminal recoverability 부족
- model uncertainty 과다
- chance safety level 미달
- backup trajectory infeasibility

이 관점에서 PSF는 단순한 runtime shield가 아니라, policy learning에 사용할 수 있는 구조적인 feedback source가 될 수 있다.

<br>

예를 들어 학습 과정에서 다음 loss를 추가할 수 있다.

$$
\|\pi_\theta(x)-\pi_S(x,\pi_\theta(x))\|^2
$$

이 loss는 policy가 PSF 개입을 덜 받는 방향으로 학습되도록 만든다. 논문의 pendulum과 quadrotor 예제에서도 PSF의 intervention magnitude를 cost에 포함시켜, 학습기가 PSF에 의존하지 않는 방향으로 수렴하도록 유도한다.

하지만 여기서 중요한 점이 있다. PSF가 개입했다는 사실만 보고 단순히 “이 행동은 나쁘다”고 해석하면 부족하다. 개입의 원인은 여러 가지일 수 있다. 예를 들어 실제 constraint boundary 때문일 수도 있고, 모델 uncertainty 때문일 수도 있으며, terminal safe set으로 돌아가는 backup trajectory가 없기 때문일 수도 있다.

따라서 PSF intervention을 학습 신호로 사용하려면, 가능하면 개입 원인을 분해해서 해석하는 것이 중요하다.

---

## 19. Relation to Differentiable MPC and Intervention Learning

<br>

PSF를 projection operator처럼 볼 수도 있다.

$$
\pi_S(x,u_L)
=
\operatorname{Proj}_{\mathcal{U}_{safe}(x)}(u_L)
$$

즉, learning policy가 제안한 입력을 현재 상태에서의 safe action set으로 projection하는 것이다.

이 관점에서 개입량은 다음과 같다.

$$
u_L-\operatorname{Proj}_{\mathcal{U}_{safe}(x)}(u_L)
$$

이는 safe action set의 boundary나 normal direction에 대한 정보를 줄 수 있다.

<br>

만약 PSF optimization을 differentiable하게 만들 수 있다면, 다음 gradient를 policy 학습에 사용할 수 있다.

$$
\frac{\partial \pi_S(x,u_L)}{\partial u_L}
$$

또는

$$
\frac{\partial}{\partial \theta}
\|\pi_\theta(x)-\pi_S(x,\pi_\theta(x))\|^2
$$

이렇게 하면 PSF는 단순한 safety filter가 아니라 differentiable safety layer가 된다.

<br>

이는 intervention learning 관점에서도 흥미롭다. 인간 개입은 보통 “이 행동은 좋지 않다”는 신호로 해석된다. 반면 PSF 개입은 더 구조적이다.

> 이 행동은 dynamics, constraints, uncertainty, terminal recoverability 기준에서 safety certificate를 통과하지 못했다.

따라서 PSF intervention은 MILE, PPL, Differentiable MPC, safe RL과 연결될 수 있다.

예를 들어 MILE이나 PPL에서는 인간 개입을 통해 policy가 어떤 상태에서 어떤 행동을 피해야 하는지 학습한다. PSF를 사용하면 인간 개입 대신, 혹은 인간 개입과 함께, dynamics와 constraints에 기반한 safety intervention을 얻을 수 있다.

이때 중요한 연구 질문은 다음과 같다.

> PSF가 수정한 action을 단순히 imitation할 것인가,  
> 아니면 PSF가 개입한 이유를 이용해 safe action set 또는 value landscape를 학습할 것인가?

단순히 수정된 action을 따라 하게 만들면 behavior cloning에 가깝다. 반면 PSF의 feasibility, intervention magnitude, active constraints, model uncertainty 등을 함께 사용하면 더 구조적인 학습 신호를 만들 수 있다.

---

## 20. Takeaways

<br>

이 논문의 핵심 정리는 다음과 같다.

1. **PSF는 learning controller를 대체하지 않는다.**
   - 성능은 learning controller가 담당하고, safety는 PSF가 담당한다.

2. **PSF는 learning input을 최소한으로 수정한다.**
   - 안전하면 그대로 통과시키고, unsafe하면 가장 가까운 안전 입력을 찾는다.

3. **Safety는 one-step constraint satisfaction이 아니다.**
   - terminal safe set으로 가는 future backup trajectory가 있어야 한다.

4. **Nominal case에서는 shrinking horizon이 recursive feasibility를 보장한다.**
   - 새 backup plan을 못 찾으면 이전 plan의 tail을 따라간다.

5. **Uncertain case에서는 constraint tightening이 필요하다.**
   - 실제 trajectory가 nominal trajectory에서 벗어나도 원래 제약을 만족해야 한다.

6. **Model confidence map은 state-input dependent uncertainty를 반영한다.**
   - 모델을 잘 아는 영역에서는 덜 보수적이고, 모르는 영역에서는 조심스럽다.

7. **Theorem 4.6은 조건부 probabilistic safety를 제공한다.**
   - 초기 feasibility, terminal safe set, local tracking, confidence map regularity가 필요하다.

8. **Pendulum 예제는 safe exploration을 보여준다.**
   - 데이터가 쌓이면 posterior uncertainty가 줄고, PSF가 덜 보수적으로 된다.

9. **Quadrotor 예제는 scalability를 보여준다.**
   - 복잡한 physical simulation에서도 unsafe learning을 막을 수 있다.

10. **PSF intervention은 학습 신호로 해석될 수 있다.**
    - 개입은 learner의 action이 safe backup certificate를 통과하지 못했다는 정보이다.

---

## Conclusion

<br>

이 논문은 safe reinforcement learning 또는 safe learning-based control 문제를 해결하기 위해 **Predictive Safety Filter**라는 모듈형 구조를 제안한다. 학습 기반 controller는 성능을 위해 입력 $u_L(k)$를 제안하고, PSF는 그 입력이 미래에도 안전한 backup trajectory를 갖는지 검사한다. 안전하면 그대로 통과시키고, 안전하지 않으면 최소한으로 수정한다. <br>

이 구조의 핵심은 성능 최적화와 안전 보장을 분리하는 것이다. 일반적인 MPC처럼 성능 cost를 직접 최적화하는 것이 아니라, PSF는 learning input을 최대한 유지하면서 safety certificate를 찾는다. 따라서 임의의 RL policy, Bayesian Optimization controller, neural policy에 붙일 수 있다. <br>

모델이 불확실한 경우에는 평균 모델 기준 trajectory를 계획하고, 실제 trajectory deviation을 고려해 state/input/terminal constraints를 tighten한다. 또한 model confidence map을 이용해 모델이 충분히 정확한 영역에서만 backup trajectory를 허용한다. 이를 통해 데이터 기반 모델을 사용하면서도 확률적 safety guarantee를 제공한다. <br>

다만 PSF는 모든 문제를 자동으로 해결하지는 않는다. 초기 feasibility가 필요하고, terminal safe set 설계가 중요하며, online optimization 부담이 있다. 또한 model uncertainty가 제대로 calibration되어 있어야 한다. <br>

그럼에도 이 논문은 학습 기반 제어기를 실제 constrained nonlinear system에 적용하기 위한 중요한 구조를 제공한다. 특히 PSF intervention을 단순한 safety correction이 아니라, learner의 action이 safe backup certificate를 통과하지 못했다는 구조적 학습 신호로 볼 수 있다는 점에서 이후 safe RL, intervention learning, differentiable MPC 기반 연구로 확장할 여지가 크다.