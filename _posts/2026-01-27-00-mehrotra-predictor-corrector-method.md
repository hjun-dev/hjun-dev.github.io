---
layout: post
title: "Mehrotra Predictor-Corrector Method"
description: "Primal-dual interior-point method로 실제 솔버 제작 시 널리 쓰이는 Mehrotra predictor-corrector method 분석"
date: 2026-01-27 12:00:00 +0900
tags: [math, study]
categories: [optimization]
related_posts: True
giscus_comments: true
pretty_table: true
pseudocode: true
toc:
  sidebar: left
---

## Introduction
<br>

[Mehrotra Predictor-Corrector Method](https://en.wikipedia.org/wiki/Mehrotra_predictor%E2%80%93corrector_method)는 **Interior Point Method (IPM)** 분야에서 가장 널리 쓰이고 강력한 알고리즘 중 하나이다. 본 포스트에서는 해당 알고리즘에 대해 알아볼 것이다.<br>

---

**Primal-dual interior-point-method**에 대한 자세한 내용은 다음 포스트를 참고 :<br>[[Convex Optimization] 16. Primal-dual interior-point-methods](https://hjun-dev.github.io/blog/2026/00-primal-dual-interior-point-method/)

---

## Outline

- **Problem definition**

- **KKT & Newton's method**

- **Predictor Step**

- **Corrector Step**

- **The Full Algorithm**

---

## Problem definition

해당 알고리즘은 Primal-dual interior-point method 계열 알고리즘으로 모든 문제에 적용 가능하다.<br>
하지만 본 포스트에서는 이해를 위해 간단한 **Linear problem (LP)** 을 가정하도록 하겠다.

$$
\begin{aligned}
&\min_x \quad \quad \quad c^{T}x\\
&\text{subject to}\; \; Ax=b,\; x\ge 0
\end{aligned}
$$

$x \in \mathbb{R}^n$, $A \in \mathbb{R}^{m\times n}$, $b \in \mathbb{R}^m$, $c \in \mathbb{R}^n$

위 문제의 dual problem은 다음과 같다.

$$
\begin{aligned}
&\max_{\lambda,s}\quad \quad \quad b^{T}\lambda\\
&\text{subject to}\; \; \; A^{T}\lambda+s=c,\; s\ge 0
\end{aligned}
$$

$\lambda\in \mathbb{R}^m$은 $Ax=b$에 대응하는 dual variable이며 $s \in \mathbb{R}^n$은 $x\ge 0$에 대응하는 dual variable이다.

---

## KKT & Newton's method

원 문제는 affine constraints를 가지기 때문에 Slater condition을 만족, strong duality가 성립한다. 따라서 해당 convex problem의 최적해는 다음의 KKT conditions과 필요충분조건을 만족한다.

$$
\begin{aligned}
A^{T}\lambda + s &= c, \quad \text{(Lagrange gradient condition)}\\
Ax &= b, \quad \text{(Feasibility condition)}\\
XSe &= 0, \quad \text{(Complementarity condition)}\\
(x,s) &\ge 0
\end{aligned}
$$

여기서 $X=\text{diag}(x)$, $S=\text{diag}(s)$, $e=(1,1,\ldots,1)^{T}\in \mathbb{R}^n$이다.<br>

Interior-point method의 핵심은 내부의 central path를 통해 최적점으로 접근하는 것이다. 이를 위해 아래와 같이 complementary slackness를 완화한 perturbed KKT conditions를 사용한다. 또한 이는 log-barrier function으로 정의한 barrier problem의 KKT conditions와 같다.

$$
\begin{aligned}
A^{T}\lambda + s &= c, \\
Ax &= b,\\
XSe &= \mu e, \\
(x,s) &\ge 0
\end{aligned}
$$

$\mu$는 barrier parameter로 큰 값에서 $0$으로 갈수록 원 문제의 optimal solution으로 수렴하며 이를 central path라고 한다.
<br>

이제 우리는 위의 (perturbed) KKT conditions를 만족하는 해를 찾는 것이 목표이다. 따라서 다음과 같이 $z=(x, \lambda, s)$에 대한 $F(z)=0$을 정의할 수 있다.

$$
\begin{aligned}
F(x,\lambda,s)
&=
\begin{bmatrix}
A^{T}\lambda + s - c \\
Ax - b \\
XSe
\end{bmatrix}
= 
\begin{bmatrix}
0 \\
0 \\
0 \\
\end{bmatrix}
,\\
&\qquad (x,s)\gt 0
\end{aligned}
$$

Central path의 경우는 좌변의 마지막 항이 $XSe - \mu e$가 된다.<br>

$F(z)$는 비선형 함수라서 한 번에 해를 구할 수 없다. 따라서 접선을 그은 뒤 0이 되는 지점으로 이동하는 Newton's root finding method를 사용한다.

$$
F(z+ \Delta z) \approx F(z)+ J(z) \Delta z=0
$$

여기서 $J(x,\lambda, s)=[\nabla_x F \quad \nabla_{\lambda} F \quad \nabla_s F]$로 $F$의 [야코비 행렬](https://en.wikipedia.org/wiki/Jacobian_matrix_and_determinant)이다. 따라서 다음의 linear system을 풀어 Newton step을 구할 수 있다.

$$
J(z) \Delta z = -F(z)
$$

위 식은 현재의 오차인 $F(z)$를 줄이기 위해 $\Delta z$가 가져야 하는 방향을 의미한다.<br>
이를 주어진 문제에 대해 쓰면 아래와 같이 나타난다.

$$
\begin{aligned}
&\begin{bmatrix}
0 & A^{T} & I \\
A & 0 & 0 \\
S & 0 & X
\end{bmatrix}
\begin{bmatrix}
\Delta x \\
\Delta \lambda \\
\Delta s
\end{bmatrix}
=
\begin{bmatrix}
- r_c \\
- r_b \\
- r_s
\end{bmatrix},
\\
&r_c = A^{T}\lambda + s - c,
\quad
r_b = Ax - b,
\\
&r_s = XSe - \mu e \quad \text{(Central Path)}
\end{aligned}
$$

위 $(2n+m) \times (2n+m)$ matrix는 크기가 매우 크기 때문에 실제 연산 시에는 블록 소거법을 사용한다. 보통 $\Delta s$와 $\Delta x$를 소거하고 $\Delta \lambda$에 대한 식만 남긴다.

- 세 번째 줄에서 $\Delta s$를 구한다.

$$
\Delta s = - X^{-1}(r_s + S \Delta x)
$$ 

- 이를 첫 번째 줄에 대입해 정리하면 최종적으로 $\Delta \lambda$를 구하기 위한 식이 나온다.

$$
(AS^{-1}XA^{T})\Delta \lambda=\text{RHS}_1
$$

여기서 $(AS^{-1}XA^{T})$ 행렬을 분해하는 과정이 알고리즘 계산 시간의 대부분을 차지하게 된다. 추후에 더 자세히 보겠지만 본 알고리즘은 이 분해를 한 번만 수행해 Predictor & Corrector 단계에 모두 써 효율적이다.

---

## Predictor Step

시작하기에 앞서 Predictor step의 목적은 크게 두 가지로 볼 수 있으며 해당 정보들은 추후 Corrector step에서 사용된다.

- $\Delta x^{\mathrm{aff}}$, $\Delta s^{\mathrm{aff}}$를 구한다.
- $\mu_{\mathrm{aff}}$를 구한다.

기존 primal-dual method에서는 central path $x_i s_i = \mu$를 따라 조심스럽게 이동했다. 하지만 본 알고리즘의 predictor step에서는 $\mu=0$으로 가정해 Newton's method를 적용한다. $\mu=0$으로 정의되는 Newton system은 아래와 같다.

$$
\begin{aligned}
&\begin{bmatrix}
0 & A^{T} & I \\
A & 0 & 0 \\
S & 0 & X
\end{bmatrix}
\begin{bmatrix}
\Delta x^{\mathrm{aff}} \\
\Delta \lambda^{\mathrm{aff}} \\
\Delta s^{\mathrm{aff}}
\end{bmatrix}
=
\begin{bmatrix}
- r_c \\
- r_b \\
- XSe
\end{bmatrix}
\end{aligned}
$$

이렇게 구한 해를 affine-scaling 방향이라고 부르고 $\Delta^{\mathrm{aff}}$라 한다.<br>
하지만 이렇게 구한 해는 $x, s \ge 0$을 만족하지 않을 수 있으므로 해당 방향으로 이동 가능한 최대 step size $\alpha_{\mathrm{aff}}$를 다음과 같이 구한다.

$$
\begin{aligned}
\alpha_{\mathrm{aff}}^{\mathrm{primal}}
&=
\min\!\left\{
1,\;
\min_{\,i:\,\Delta x_i^{\mathrm{aff}}<0}
\left(
-\frac{x_i}{\Delta x_i^{\mathrm{aff}}}
\right)
\right\}, \\[0.6em]
\alpha_{\mathrm{aff}}^{\mathrm{dual}}
&=
\min\!\left\{
1,\;
\min_{\,i:\,\Delta s_i^{\mathrm{aff}}<0}
\left(
-\frac{s_i}{\Delta s_i^{\mathrm{aff}}}
\right)
\right\}
\end{aligned}
$$

둘 중 더 작은 값이 $\alpha_{\mathrm{aff}}$가 된다.<br>
$\alpha_{\mathrm{aff}}$가 1에 가깝다면 현재 위치에서 최적해까지 경로가 거의 직선이라 $\mu$를 과감하게 줄여도 1차 근사인 Newton step으로 충분히 괜찮다는 의미를 가진다.
반면 $\alpha_{\mathrm{aff}}$가 매우 작다면 경로가 선형이 아니며 $\mu$를 천천히 줄여나가야 함을 의미한다.
<br>

실제로 이동하지는 않았지만 $\alpha_{\mathrm{aff}}$만큼 이동 시에 surrogate duality gap이 얼마나 줄어들지 계산할 수 있다.

- $\mu_{\mathrm{curr}} = (x^T s)/n$

- $\mu_{\mathrm{aff}}=(x+\alpha_{\mathrm{aff}} \Delta x^{\mathrm{aff}})^T (s+\alpha_{\mathrm{aff}} \Delta s^{\mathrm{aff}})/n$

---

## Corrector Step

Centering step에서 기존 primal-dual IPM은 $\mu e$에 매번 $\beta\gt1$에 대해 $\frac{1}{\beta}$을 곱해 $\mu$가 iterate을 거듭하며 $0$으로 가도록 유도했다. 하지만 본 알고리즘은 다음과 같이 $\sigma$를 정의해 $\mu$의 감소율을 조정한다.

$$
\sigma = \left(\frac{\mu_{\mathrm{aff}}}{\mu_{\mathrm{curr}}}\right)^3
$$

경우를 나눠서 생각해보자.<br> 
$\alpha_{\mathrm{aff}}\approx 1$이라면 affine-scaling 방향으로 경계까지 거의 한 번에 가도 될 만큼 positivity가 덜 깨지고 안전하게 갈 수 있음을 의미하며 $\sigma$는 작은 값을 가진다. 따라서 $\mu$는 다음 iterate에서 값이 급격히 감소한다.<br>
$\alpha_{\mathrm{aff}}\ll 1$이라면 경계에 대해 위험해 비교적 짧게 이동해야 함을 의미하고 $\sigma$는 1에 가까운 값을 가진다. 따라서 $\mu$는 다음 iterate에서 큰 변화 없이 조금 감소한다.
<br>

다음으로 설명할 내용은 Mehrotra predictor-corrector method의 가장 중요한 부분이다.<br>
앞에서 정의했던 perturbed KKT conditions의 $x_i s_i = \mu$는 Newton step을 통해 아래 식을 만족하는 $\Delta s_i, \Delta x_i$를 얻는다.

$$
x_i s_i + x_i \Delta s_i + s_i \Delta x_i = \mu
$$

하지만 $\Delta s_i, \Delta x_i$ 만큼 이동하면 아래와 같은 값을 가지게 된다.

$$
(x_i + \Delta x_i) (s_i + \Delta s_i) = x_i s_i + x_i \Delta s_i + s_i \Delta x_i + \Delta x_i \Delta s_i
$$

따라서 Newton system의 RHS에 오차항을 빼주고 Newton step을 구하면 아래와 같이 실제 이동 결과 $\mu$를 만족하게 된다.

$$
x_i s_i + x_i \Delta s_i + s_i \Delta x_i = \mu-\Delta s_i\Delta x_i \\
\Leftrightarrow \; x_i s_i + x_i \Delta s_i + s_i \Delta x_i +\Delta s_i\Delta x_i = \mu
$$

이게 corrector step 내부에서 일어나는 일이다.<br>

최종적으로 다음과 같은 Newton system의 해를 구한다.

$$
\begin{aligned}
&\begin{bmatrix}
0 & A^{T} & I \\
A & 0 & 0 \\
S & 0 & X
\end{bmatrix}
\begin{bmatrix}
\Delta x \\
\Delta \lambda \\
\Delta s
\end{bmatrix}
=
\begin{bmatrix}
- r_c \\
- r_b \\
- (XSe-\sigma\mu e + \Delta X^{\mathrm{aff}}\Delta S^{\mathrm{aff}}e)
\end{bmatrix}
\end{aligned}
$$

마찬가지로 해당 matrix를 $\Delta\lambda$에 대해 정리하면

$$
(AS^{-1}XA^{T})\Delta \lambda=\text{RHS}_2
$$

이다. 좌변의 matrix는 동일하게 나타나므로 분해(factorization) 과정이 추가로 필요하지 않다.<br>
해당 결과로 나오는 $\Delta$가 바로 Mehrotra predictor-corrector method의 최종 이동 방향이 된다.<br>

하지만 우변에 등장하는

$$
- (XSe-\sigma\mu e + \Delta X^{\mathrm{aff}}\Delta S^{\mathrm{aff}}e)
$$
를 보면 한 가지 의문이 생길 수 있다. $\Delta X^{\mathrm{aff}}$, $\Delta S^{\mathrm{aff}}$는 $\mu=0$으로 설정한 affine-scaling predictor step에서 계산된 방향인데 실제로 우리가 목표로 하는 central path는 $XSe = \sigma \mu e$이기 때문이다.<br>
엄밀하게 말하면 $XSe-\sigma \mu e$에 대한 Newton 선형화 오차 보정항은 해당 우변을 기준으로 다시 Newton system을 풀어 얻은 $\Delta X$, $\Delta S$로부터 계산되어야 한다. 즉, $\Delta X^{\mathrm{aff}}\Delta S^{\mathrm{aff}}$는 정확한 2차 오차 보정항은 아니다.<br>
그러나 이를 정확히 반영하려면 추가적인 Newton solve가 한 번 더 필요하게 된다. Mehrotra predictor-corrector method는 이 점에서 엄밀한 2차 보정보다는 계산 효율과 실질적인 centrality 개선을 선택한다. 실제로 $\sigma$ 자체가 affine predictor에서의 $XSe$ 감소량을 기반으로 정의되기 때문에 $\Delta X^{\mathrm{aff}}\Delta S^{\mathrm{aff}}$는 central path로부터의 이탈 방향과 크기를 충분히 잘 포착한다.<br>

따라서 central path에서 크게 벗어나지 않는 영역에서는 $\Delta X^{\mathrm{aff}}\Delta S^{\mathrm{aff}}$를 그대로 사용하는 근사가 수렴성과 효율 면에서 매우 효과적이게 된다.

---

## The Full Algorithm

최종적으로 $\Delta = (\Delta x, \Delta \lambda, \Delta s)$의 방향을 구했다.<br> 이제 $x_i \gt 0, s_i \gt 0$을 만족하기 위해 아래 과정으로 step size를 고른다. $\eta$는 0.9995와 같은 값을 사용해 부등호가 유지되도록 보장한다.

$$
\begin{aligned}
\alpha_{\max}^{\mathrm{primal}}
&=
\min\!\left\{
1,\;
\min_{\,i:\,\Delta x_i<0}
\left(
-\frac{x_i}{\Delta x_i}
\right)
\right\}, \\[1.5em]
\alpha_{\max}^{\mathrm{dual}}
&=
\min\!\left\{
1,\;
\min_{\,i:\,\Delta s_i<0}
\left(
-\frac{s_i}{\Delta s_i}
\right)
\right\}, \\[1.5em]
\alpha_{\mathrm{final}}
&=
\eta\,\min\!\left\{
\alpha_{\max}^{\mathrm{primal}},
\alpha_{\max}^{\mathrm{dual}}
\right\}.
\end{aligned}
$$


---

**Mehrotra predictor-corrector method**<br>

**[초기화 (Initialization)]**
- Strictly feasible한 $(x^{(0)},\lambda^{(0)}, s^{(0)})$을 잡는다.

**[메인 루프 (Main Loop)]**<br>

$1.$ **Residual 계산**

- 현재 $r_c, r_b$와 $\mu = x^T s/n$을 계산한다.

- 수렴 판정: 만약 residual과 $\mu$가 충분히 작다면 최적해로 수렴했다고 판단하고 종료한다.

$2.$ **Factorization**

- Newton system의 좌변 행렬을 factorization(Cholesky, sparse 등)한다. (가장 오래걸리는 작업)

$3.$ **Predictor Step**

- 우변을 $-F(z)$로 설정한다. $(\mu=0)$

- 분해된 행렬을 이용해 $\Delta^{\mathrm{aff}}$을 구한다.

- 해당 방향으로의 최대 거리 $\alpha_{\mathrm{aff}}$을 구한다.

$4.$ **Centering Parameter**

- $\mu_{\mathrm{aff}}$을 바탕으로 $\sigma=(\mu_{\mathrm{aff}}/\mu)^3$을 계산한다.

$5.$ **Corrector Step**

- 우변을 수정해 central path 항 $\sigma \mu$와 $-\Delta X^{\mathrm{aff}}\Delta S^{\mathrm{aff}}$을 추가한다.

- 분해된 행렬을 재사용해 최종 방향 $\Delta$를 구한다.

$6.$ **Update**

- $\eta\approx 0.999$를 적용해 최종 step size $\alpha$를 정한다.

- 변수를 업데이트한다.

$$
\begin{aligned}
x &\leftarrow x + \alpha\,\Delta x,\\[0.6em]
\lambda &\leftarrow \lambda + \alpha\,\Delta \lambda,\\[0.6em]
s &\leftarrow s + \alpha\,\Delta s
\end{aligned}
$$

