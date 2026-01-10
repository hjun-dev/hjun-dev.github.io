---
layout: post
title: "[Convex Optimization] 12. KKT conditions"
description: "Karush-Kuhn-Tucker (KKT) Conditions에 대한 분석"
date: 2026-01-08 14:00:00 +0900
tags: [math, study]
categories: [optimization]
related_posts: True
toc:
  sidebar: left
---

## Introduction
<br>

이 포스트에서는 **Karush-Kuhn-Tucker (KKT) Conditions**을 정의하고 그 의미를 이해한다.

---

## Primal & Dual problems

**Primal problem**
<br>

$$
\begin{aligned}
\min_{x} \quad 
& f(x) \\[0.5em]
\text{subject to} \quad
& h_i(x) \le 0, \qquad i = 1,\ldots,m, \\
& \ell_j(x) = 0, \qquad j = 1,\ldots,r.
\end{aligned}
$$

위 primal problem에 대한 Lagrangian은 

$$
L(x,u,v)=f(x)+\sum^{m}_{u=1}u_{i}h_{i}(x)+\sum^{r}_{j=1}v_{j}\ell_{j}(x)$$

Lagrange dual function은 $g(u,v)=\min_{x}L(x,u,v)$ 로 정의된다.<br>

**Dual problem**
<br>

$$
\begin{aligned}
\max_{u,v} \quad
& g(u,v) \\[0.5em]
\text{subject to} \quad
& u \ge 0.
\end{aligned}
$$

아래는 중요한 특징들이다.

1. Lagrange dual function $g(u,v)$는 항상 **concave function**이다.
<br>

2. **Weak duality**: $f^{\ast}\ge g^{\ast}$
<br>

3. **Slater's condition**: Primal convex problem이 최소한 하나의 **strictly feasible point**를 가지거나 inequality constraints가 **affine**인 경우 **strong duality**가 성립한다. 

---

## Karush-Kuhn-Tucker (KKT) Conditions

General primal problem에 대해 KKT conditions는 다음과 같다.

1. (**Stationary**)
$$ 0\in \partial_x \bigl(f(x)+\sum^{m}_{i=1}u_{i}h_{i}(x)+\sum^{r}_{j=1}v_j \ell_j(x)\bigr) 
$$  
<br>

2. (**Complementary slackness**) $u_i \cdot h_i (x) = 0$ for all $i$
<br>

3. (**Primal feasibility**) $h_i (x) \le 0, \ell_j (x) =0$ for all $i, j$
<br>

4. (**Dual feasibility**) $u_i \ge 0$ for all $i$

---

주의: 만약 objective function $f$가 convex하지 않다면 $f$가 미분가능하더라도 $\partial_x f(x)=\{\triangledown f(x)\}$라고 할 수 없음을 주의하자.<br>
(Subgradient & subdifferential의 정의 기억)

---
**Theorem   (Sufficiency)**
<br>

**Convex primal problem**에서 어떤 $x^{\ast}$, $u^{\ast}$, $v^{\ast}$가 **KKT 조건**을 만족하면 각각 **primal optimal solution**과 **dual optimal solution**이다.

$$
\text{KKT} \Rightarrow \text{optimal solutions}
$$
<br>

**Proof**
<br>

만약 어떤 $x^{\ast}$, $u^{\ast}$, $v^{\ast}$가 KKT 조건을 만족한다면 $g(u^{\ast}, v^{\ast})=f(x^{\ast})+\sum_{i=1}^{m}u_{i}^{\ast}h_{i}(x^{\ast})+\sum_{j=1}^{r}v_{j}^{\ast}\ell_{j}(x^{\ast})=f(x^{\ast})$이다. <br>
(처음 등호는 **stationary 조건**으로, 두번째 등호는 **complementary slackness**에 의해 성립된다.)<br>
**Weak duality**에 의해 $f(x)\ge g(u^{\ast},v^{\ast})=f(x^*)$ for all $x$이므로 **최적해**임이 증명된다.

<br>

**Theorem   (Necessity & Sufficiency)**
<br>

Convex problem에 대해 **strong duality**가 성립한다면 어떤 $x^{\ast}$, $u^{\ast}$, $v^{\ast}$에 대한 **KKT 조건**은 **primal & dual solutions**이기 위한 **필요충분조건**이 된다.

**Proof**
<br>

충분조건의 증명은 Sufficiency theorem에 대한 증명과 같다.<br>
필요조건은 strong duality을 이용해 아래 식으로 증명된다.

$$
\begin{aligned}
f(x^\ast)
&= g(u^\ast, v^\ast) \\[0.5em]
&= \min_{x}
\left(
f(x)
+ \sum_{i=1}^{m} u_i^\ast h_i(x)
+ \sum_{j=1}^{r} v_j^\ast \ell_j(x)
\right) \\[0.8em]
&\le
f(x^\ast)
+ \sum_{i=1}^{m} u_i^\ast h_i(x^\ast)
+ \sum_{j=1}^{r} v_j^\ast \ell_j(x^\ast) \\[0.8em]
&\le
f(x^\ast).
\end{aligned}
$$

마지막 RHS가 다시 $f(x^{\ast})$가 되므로 부등호가 전부 등호가 된다.<br>
KKT 조건을 하나씩 보면 먼저 $x^{\ast}$, $u^{\ast}$, $v^{\ast}$가 solutions로 존재하니 **primal & dual feasibility**는 성립한다.<br>

$\min_{x}\left(f(x)+ \sum_{i=1}^{m} u_i^\ast h_i(x)+ \sum_{j=1}^{r} v_j^\ast \ell_j(x)\right)=f(x^\ast)+ \sum_{i=1}^{m} u_i^\ast h_i(x^\ast)+ \sum_{j=1}^{r} v_j^\ast \ell_j(x^\ast)$ 이므로 **stationary condition**을 만족하게 된다.
<br>

$f(x^\ast)+ \sum_{i=1}^{m} u_i^\ast h_i(x^\ast)+ \sum_{j=1}^{r} v_j^\ast \ell_j(x^\ast)=f(x^{\ast})$를 보면 **complementary slackness**가 성립됨을 알 수 있다. 

---

## History of KKT

KKT 조건은 원래 **KT(Kuhn-Tucker)** 조건으로 알려졌다.<br>
해당 조건은 1951년에 Kuhn과 Tucker의 publication에서 처음 등장했다. 하지만 1939년에 Karush의 unpublished master's thesis에서 먼저 등장했었음이 밝혀져 **KKT(Karush-Kuhn-Tucker)** 조건으로 명명됐다.
<br>

**Unconstrained problem**에 대해서 KKT 조건은 단순히 **subgradient optimality condition**과 같아진다.<br>
**General convex problem**에서 KKT 조건은 optimality를 다음의 **subgradient 조건**으로 찾으려는 방법인 것이다.

$$
0 \in \partial f(x^\star)
+ \sum_{i=1}^{m} N_{\{\,h_i \le 0\,\}}(x^\star)
+ \sum_{j=1}^{r} N_{\{\,\ell_j = 0\,\}}(x^\star)
$$

위 식은 KKT 조건의 stationary condition을 **normal cone**으로 표현한 식이다.<br> 
(Indicator function의 subgradient는 normal cone임을 사용)

---

## KKT Examples

이 파트에선 여러 문제들에 KKT 조건을 적용한 예시들을 소개하겠다.

---

### Quadratic with Equality Constraints

$Q\succeq 0 $에 대해

$$
\begin{aligned}
\min_{x} \quad & \frac{1}{2} x^{T} Q x + c^{T} x \\
\text{subject to} \quad & A x = 0
\end{aligned}
$$

이 문제는 $Ax=b$ 제약을 건 Newton step과 유사하며 이는 후에 Newton Method에서 다룰 것이다.<br>
KKT 조건: $x$ is a solution if and only if

$$
\begin{bmatrix}
Q & A^{T} \\
A & 0
\end{bmatrix}
\begin{bmatrix}
x \\
u
\end{bmatrix}
=
\begin{bmatrix}
- c \\
0
\end{bmatrix}
$$

---

### Water-Filling

다음과 같은 문제를 water-filling이라고 한다.

$$
\begin{aligned}
\min_{x} \quad & -\sum_{i=1}^{n} \log(\alpha_i + x_i) \\
\text{subject to} \quad & x \ge 0,\; \mathbf{1}^{T} x = 1
\end{aligned}
$$

이 문제는 정보이론에서 등장하는 최적화 문제이며 각 변수 $x_i$는 $i$번째 채널에 할당되는 송신 전력을 의미하며 $\log(\alpha_i + x_i )$는 해당 채널의 capacity를 의미한다.<br>
따라서 이 문제는 총 전력의 합이 1로 제한된 상황에서 각 채널에 전력을 어떻게 분배해야 전체 capacity를 최대화할 수 있는지를 결정하는 문제로 해석할 수 있다.
<br>
해당 문제의 KKT 조건은 다음과 같다.

$$
\begin{aligned}
-\frac{1}{\alpha_i + x_i} - u_i + v = 0,
\qquad i = 1,\ldots,n, \\[0.5em]
u_i \cdot x_i = 0,
\qquad i = 1,\ldots,n, \\[0.5em]
x \ge 0,
\qquad \mathbf{1}^{T} x = 1,
\qquad u \ge 0
\end{aligned}
$$

$u_i$를 지우면

$$
\begin{aligned}
-\frac{1}{\alpha_i + x_i} \le v,
\qquad i = 1,\ldots,n, \\[0.8em]
x_i\left( v - \frac{1}{\alpha_i + x_i} \right) = 0,
\qquad i = 1,\ldots,n, \\[0.8em]
x \ge 0,
\qquad \mathbf{1}^{T} x = 1
\end{aligned}
$$

$x_i$가 양수인 경우와 0인 경우로 나눠서 조건을 해석하면 아래와 같은 해가 나온다.

$$
x_i
=
\begin{cases}
\dfrac{1}{v} - \alpha_i, & \text{if } v < \dfrac{1}{\alpha_i}, \\[0.8em]
0, & \text{if } v \ge \dfrac{1}{\alpha_i},
\end{cases}
\;=\;
\max\!\left\{\,0,\; \dfrac{1}{v} - \alpha_i \right\},
\qquad i = 1,\ldots,n
$$

또한 $\mathbf{1}^Tx=\mathbf{1}$에 의해 아래와 같이 나타난다.

$$
\sum_{i=1}^{n} \max\left\{ 0,\; \frac{1}{v} - \alpha_i \right\} = 1
$$

이러한 해를 water-filling이라고 부른다. 주어진 $\alpha_i$를 ground level로 생각하고 채우는 물의 합이 1일때 가능한 $\frac{1}{v^{\ast}}$까지 물을 채우는 문제로 생각할 수 있다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/waterfilling.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Illustration of water-filling algorithm.<br>
    (Convex Optimization (Boyd & Vandenberghe))
</div>
<br>

---

### Support Vector Machines

$y \in \{-1, 1\}^n$, $X\in \mathbb{R}^{n \times p}$에 대해 support vector machine 문제는 다음과 같이 정의된다.

$$
\begin{aligned}
\min_{\beta,\beta_0,\xi} \quad
& \frac{1}{2}\,\|\beta\|_2^2
+ C \sum_{i=1}^{N} \xi_i \\[0.5em]
\text{s.t.} \quad
& \xi_i \ge 0,
\qquad i = 1,\ldots,n, \\[0.5em]
& y_i\bigl(x_i^{T}\beta + \beta_0\bigr)
\ge 1 - \xi_i,
\qquad i = 1,\ldots,n
\end{aligned}
$$

Dual variables $u,w\ge 0$에 대해서 KKT stationary 조건은
$$
0 = \sum_{i=1}^{n} w_i y_i,
\qquad
\beta = \sum_{i=1}^{n} w_i y_i x_i,
\qquad
w = C \mathbf{1} - v
$$

Complementary slackness 조건은

$$
\nu_i \xi_i = 0,
\qquad
w_i\bigl(1 - \xi_i - y_i(x_i^{T}\beta + \beta_0)\bigr) = 0,
\qquad i = 1,\ldots,n
$$

따라서 optimal point에서 $\beta = \sum^n_{i=1}w_i y_i x_i$ 조건과 $y_i(x_i^T \beta + \beta_0)=1-\xi_i $라면 $w_i$는 0이 아닌 조건이 나온다.<br>
이러한 point들을 **support points**라고 부른다.<br>
($\xi_i<0$일 수 없으니 마진 밖에 있는 데이터들은 support points가 아니다.)
<br>

만약 $x_i$가 **마진 경계**에 있다면 $\xi_i$는 0이고 $0 \lt w_i\le C$이 된다.
<br>
만약 $x_i$가 **마진 안쪽**에 있지만 오분류가 아닌 경우에 $0 \lt \xi_i \lt 1$이고 $w_i=C$이다.
<br>
마지막으로 $x_i$가 **오분류**한 경우에 $\xi_i \gt 1$이고 $w_i=C$가 된다.
<br>
이렇게 구한 $w_i$는 해당 데이터가 $\beta$에 관여하는 **가중치**를 의미한다. KKT 조건을 살펴보면 이는 직관적으로 support vector machine을 만드는 데 합리적으로 작용하는 것을 알 수 있다.<br>
이 정보를 이용해 non-support points를 사전에 미리 알고 제거해 문제의 크기를 줄일 수 있다.<br>
(KKT 조건 자체가 해를 직접 구해주지는 않음.)

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/kktsvm.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Illustration of support vector machine.<br>
    (Convex Optimization (Boyd & Vandenberghe))
</div>
<br>

## Constrained and Lagrange Forms

**Lemma**<br>
$t\in \mathbb{R}$와 $\lambda \ge 0$에 대해 $f, h$가 **convex function**이고 constrained form이 **strictly feasible**이라면 아래의 두 forms는 동일하다.
<br>

$$
\begin{aligned}
\textit{Constrained Form (C)} 
& \qquad \min_{x} \; f(x)
\quad \text{subject to } h(x) \le t \\[0.5em]
\textit{Lagrange Form (L)} 
& \qquad \min_{x} \; f(x) + \lambda \cdot h(x)
\end{aligned}
$$

<br>

**해석** <br>
제약을 거는 경우 주로 위 두 형태로 문제를 정의한다. (C) 방식에서는 특정 $t \ge 0$을 골라 문제를 완화시키거나 objective function에 t를 포함시켜 제약을 만족하게 한다.<br>
(L) 방식에서는 제약조건을 벗어나는 만큼 objective function에 들어가게 문제를 정의해 제약을 만족시키는 해를 찾도록 한다. 사전에 충분히 큰 $\lambda$를 설정하거나 $\lambda$를 점진적으로 키우는 방식으로 제약을 만족하는 해를 찾는다.<br>
이 두 방식의 해가 동일하게 나오기 위해서는 서로 어떤 대응되는 $t$와 $\lambda$를 골라야 하는지 알아보고 Lemma와 같이 두 방식이 동일한 해를 같도록 하는 파라미터가 항상 찾아지는지 살펴보도록 하겠다.



**Proof**<br>

**(C) to (L)** : 만약 (C)가 strictly feasible하다면 strong duality가 성립한다. Stationary condition에 의해 다음 식을 최소화하는 $x^{\ast}$ 몇몇 $\lambda \ge 0$에 대해 찾을 수 있다.

$$
f(x^{\ast})+\lambda \cdot (h(x^{\ast})-t)
$$

$x^{\ast}$는 마찬가지로 (L)를 minimize하는 solution 중 하나가 된다. 따라서 다음이 성립한다.

$$
\bigcup_{\lambda \ge 0} \{\, \text{solutions in } (L) \,\}
\;\supseteq\;
\bigcup_{\,t \in \{\, t : h(x) < t,\ \forall x \,\}}
\{\, \text{solutions in } (C) \,\}
$$

<br>

**(L) to (C)** : $x^{\ast}$가 (L)의 solution이고 $t=h(x^{\ast})$ 를 고르면 (C)의 KKT condition은 만족된다.<br>
따라서 다음이 성립한다.

$$
\bigcup_{t \ge 0} \{\, \text{solutions in } (C) \,\}
\;\supseteq\;
\bigcup_{\lambda \ge 0} \{\, \text{solutions in } (L) \,\}
$$

그러므로 두 문제는 **거의** 항상 서로 변환 가능한 문제 형태이다.<br>
**'거의'** 가 붙는 이유는 (C)에서 특정 $t$를 고르면 Slater's condition을 만족하지 못하는 경우가 존재할 수 있기 때문이다. 하지만 strictly feasible하지 않은 constraint set이 발생하는 $t$가 0 하나뿐이라면 strictly feasible한 문제들의 경계에 해당하게 된다. 따라서 Slater's condition을 만족하지 못하는 $t$가 0뿐이면 대응 관계는 깨지지 않는다.<br>
직관적으로 보면 strictly feasible한 문제들에 대해 $t$를 점점 줄여가며 경계 $t=0$에 접근하는 것은 대응 관계가 깨지지 않아 괜찮다는 해석이 가능하다.

---

## Uniqueness in $\ell_1$ Penalized Problems

$y\in \mathbb{R}^n$, $X \in \mathbb{R}^{n\times p}$, $\lambda \ge 0$에 대해 다음의 lasso problem을 가정하자.

$$
\min_{\beta \in \mathbb{R}^{p}} \;
\frac{1}{2}\,\|y - X\beta\|_2^{2}
+ \lambda \|\beta\|_1
$$

위 문제의 해 $\beta$는 $X$의 rank에 따라 해의 형태가 달라진다.

1. $\text{rank}(X)=p$인 경우 : $X$의 column들이 **선형 독립**임을 의미한다. $\frac{1}{2}\,||y - X\beta||_2^{2}$ 항의 **Hessian**은 $X^T X$이며 **positive definite**이다. 따라서 첫 항은 **strictly convex**한 function이다. $\ell_1$ function은 **convex**이므로 전체 목적함수는 **strictly convex**하다. 따라서 이 경우에 문제의 해는 항상 **유일**하다.
<br>

2. $\text{rank}(X)\lt p$인 경우 : $X$의 column들이 **선형 종속**임을 의미한다. wide($p \gt n$) 행렬은 반드시 이 경우에 포함되며 wide 행렬이 아니더라도 rank에 따라 포함 여부가 결정될 수 있다. 이때 $X^T X$는 **positive semidefinite**이므로 strictly convex가 아닌 **convex**한 특징을 가진다. 따라서 전체 목적함수는 **convex** 특징을 가지며 해가 **여러 개** 생길 수 있다.
<br>

본 파트에서는 2번과 같이 **rank deficient**한 상황 중에서 어떤 경우에 해가 유일하게 결정되는지를 알아보고자 한다.
<br>

Convex 함수의 중요한 특징 중 하나는 최적해가 여러 개 존재하는 경우 해가 무수히 많아진다는 것이다.<br>
최적해가 $\beta^{(1)}$, $\beta^{(2)}$로 두 개 존재한다고 가정하자.<br>
목적함수가 **convex function**이므로 $\beta^{(1)}$와 $\beta^{(2)}$를 잇는 선분 위의 모든 점 $\beta_\alpha = \alpha \beta^{(1)}+(1-\alpha) \beta^{(2)}$은 전부 minimizer가 되며 모두 같은 **optimal value**를 가진다.<br>

이제 모든 해의 특징을 알아보자.<br>
목적함수에 $\beta_\alpha$를 대입하면 다음과 같다.

$$
F(\beta_\alpha) = 
\frac{1}{2}\,\|y - \bigl(\alpha X\beta^{(1)} + (1-\alpha)X\beta^{(2)}\bigr)\|_2^{2}
+ \lambda \|\alpha\beta^{(1)}+(1-\alpha)\beta^{(2)}\|_1
$$

$F(\beta)=\frac{1}{2}\,\|y - X\beta\|_2^{2}+ \lambda \|\beta\|_1$ 는 **convex function**이다. 따라서

$$
F(\beta_\alpha)\le \alpha F(\beta^{(1)})+(1-\alpha)F(\beta^{(2)})
$$

하지만 이 세 항이 모두 **minimizer**여야 하므로 등호가 성립된다.
<br>

$F(\beta_\alpha)$의 내부를 살펴보면 $\alpha$에 대해 convex한 두 번째 항과 달리 첫 번째 항은 **strictly convex** 할 수 있지만 $F$에 대한 부등식이 등호로 만족되려면 **strictly convex**한 항이 있어서는 안된다는 것을 알 수 있다. 더 자세히 보면 첫 항의 $\alpha$에 대한 **second derivative**은 다음과 같다.

$$
\|X(\beta^{(1)}-\beta^{(2)})\|^2_2
$$

이때 두 벡터 $\beta^{(1)}$과 $\beta^{(2)}$를 잇는 선이 $X$의 **null space**에 존재하지 않는다면 첫 항은 $\alpha$에 대한 **strictly convex function**이 된다. 
<br>

따라서 첫 항의 $\alpha$에 대한 **second derivative**를 0으로 만들기 위해 $\beta^{(1)}$과 $\beta^{(2)}$를 잇는 선이 $X$의 **null space**에 존재해야 한다. $\beta^{(1)}-\beta^{(2)} \in \text{null}(X)$이므로

$$
X(\beta^{(1)}-\beta^{(2)})=X(\beta^{(1)}-\beta_\alpha)=0
$$

따라서 $X\beta$는 항상 일정하다. <br>

$F$의 각 항의 값이 일정해야 하므로 $||\beta||_1$ 또한 일정하다.
<br>

지금까지 해가 무수히 많이 존재할 때 $X\beta$와 $||\beta||_1$이 동일한 값을 가짐을 확인했다. <br>
이제 objective function의 KKT 조건을 살펴보겠다.

$$
0 \in \bigl(-X^{T}(y-X\hat{\beta}) + \lambda \partial\|\hat{\beta}\|_1 \bigr)
$$

따라서 $\exists \ \gamma \in \partial||\hat{\beta}||_1$ 에 대해 다음을 만족한다.

$$
X^{T}(y-X\hat{\beta}) = \lambda \gamma
$$

$\ell_1$ norm의 subgradient는 다음과 같다.

$$
\gamma_i =
\begin{cases}
\operatorname{sign}(\hat{\beta}_i), & \hat{\beta}_i \neq 0, \\
\in [-1,1], & \hat{\beta}_i = 0,
\end{cases}
\qquad i = 1,\ldots,p
$$

**KKT condition**은 아래와 같이 다시 쓸 수 있다.

$$
X_i^{T}(y-X\hat{\beta}) = \lambda \gamma_i
$$

LHS을 해석해보면 $X$의 column과 데이터에 대한 잔차의 **correlation**인 것을 알 수 있다.<br>

여기서 RHS의 최댓값인 $\lambda$에 도달하는 index들의 집합을 **Equicorrelation set**이라고 정의한다.

$$
\mathcal{E}
=
\left\{
i \in \{1,\ldots,p\}
:
\left| X_i^{T}\bigl(y - X\hat{\beta}\bigr) \right|
= \lambda
\right\}
$$

**Equicorrelation set**에는 $\hat{\beta}_i$가 0이 아닌 index 들과 $\hat{\beta}_i$가 0이지만 $|\gamma_i|=1$인 index들이 속하게 된다.<br>
이번엔 **Equicorrelation sign** $s$를 다음과 같이 정의한다. <br>
Equicorrelation set에 속하지 못하는 index는 전부 제외하고 속하는 index들의 부호를 넣은 벡터이다.

$$
s
=
\operatorname{sign}\!\left(
X_{\mathcal{E}}^{T}(y - X\hat{\beta})
\right)
\in
\{-1,1\}^{|\mathcal{E}|}
$$

$\hat{\beta}$중 nonzero component는 반드시 $\mathcal{E}$에만 속하게 되며 $-\mathcal{E}$에는 반드시 zero component만 존재한다. 

$$
\hat{\beta}_{-\mathcal{E}}=0
$$

이제 $\mathcal{E}$에 속하는 index로만 KKT 조건을 다시 써보면

$$
X_{\mathcal{E}}^{T}(y-X_{\mathcal{E}}\hat{\beta}_\mathcal{E})=\lambda\gamma_\mathcal{E}=\lambda s
$$

이걸 정리하면

$$
X_{\mathcal{E}}^T X_{\mathcal{E}} \hat{\beta}_\mathcal{E}=X_{\mathcal{E}}^T y -\lambda s
$$

이 $X^T_{\mathcal{E}}X_{\mathcal{E}}$는 역행렬이 보장되지 않으므로 **pseudo inverse**를 사용해 $X_\mathcal{E}^{T}X_\mathcal{E}$의 range에 속하는 해를 구하고 $\text{null}(X_\mathcal{E}^{T}X_\mathcal{E})=\text{null}(X_\mathcal{E})$에 속하는 벡터를 더해 모든 해를 표현 가능하다.

$$
\hat{\beta}_{\mathcal{E}}
=
\left(X_{\mathcal{E}}^{T} X_{\mathcal{E}}\right)^{+}
\left(X_{\mathcal{E}}^{T} y - \lambda s\right)
+ b,
\qquad
b \in \operatorname{null}(X_{\mathcal{E}})
$$

또한 이전에 확인한 것처럼 

$$
\hat{\beta}_{-\mathcal{E}}=0
$$

따라서 nonzero component는 $\hat{\beta}$에 대한 분석 대신 $\hat{\beta}_{\mathcal{E}}$가 존재하는 공간에 대한 분석만으로 충분하다.
<br>

그럼 언제 해가 유일해질까? $b\in \text{null}(X_\mathcal{E})$가 해를 무수히 많게 만드는 요인이므로 $\text{null}(X_\mathcal{E})=\{0\}$라면 해는 유일하게 존재한다.<br>
또한 nonzero component의 수는 $\text{rank}(X_\mathcal{E})$보다 작거나 같아야 하므로 최대 $\text{min} \{n,p\}$개 가능하다.
<br>

그럼 이제 주된 관심사는 언제 $\text{null}(X_\mathcal{E})=\{0\}$가 되느냐는 것이다. <br>
이를 이해하기 위해 $\text{null}(X_\mathcal{E})\ne\{0\}$인 경우를 가정해보자. 그럼 $\mathcal{E}$의 column들의 선형 종속 관계에 의해 다음이 성립한다.

$$
X_i
=
\sum_{j \in \mathcal{E} \setminus \{i\}} c_j X_j
$$

위 식의 양변에 $s_i$를 곱하고 우항에 $s_j s_j =1$를 곱하면 다음과 같다.

$$
s_i X_i
=
\sum_{j \in \mathcal{E} \setminus \{i\}}
\left( s_i s_j c_j \right)\cdot \left( s_j X_j \right)
$$

위 식의 양변에 $(y-X\hat{\beta})^T$를 곱하여 아래 관계를 이용한다.

$$
X_i^{T}(y-X_\mathcal{E}\hat{\beta}_\mathcal{E})=\lambda s_i
$$

결과적으로

$$
\lambda
=
\sum_{j \in \mathcal{E} \setminus \{i\}}
\left( s_i s_j c_j \right)\lambda
\quad \text{and} \quad
\sum_{j \in \mathcal{E} \setminus \{i\}}
\left( s_i s_j c_j \right)
=
1
$$

따라서 다음이 성립한다.

$$
s_i X_i
=
\sum_{j \in \mathcal{E} \setminus \{i\}} a_j \cdot s_j X_j,
\quad \text{with} \quad
\sum_{j \in \mathcal{E} \setminus \{i\}} a_j = 1
$$

이것이 의미하는 바는 $s_i X_i$가 $ \{s_j X_j:j \in \mathcal{E}\setminus \{i \} \} $의 affine span에 존재한다는 것이다. 다음 그림은 이를 그림으로 나타낸다.


<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/affinespanunique.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Example of Affine Span
</div>
<br>

따라서 이전에 알아본 것처럼 $\text{null}(X_\mathcal{E})\ne\{0\}$가 성립하려면 column들이 선형 종속일 뿐 아니라 어떤 $i$에 대해 $s_{i}X_{i}$가 나머지의 affine hull에 들어가야 한다.
<br>

$X$의 column들이 [general position](https://en.wikipedia.org/wiki/General_position)을 만족하면 위 조건을 만족하게 되며 Lasso problem의 해는 유일하게 정해지며 아래와 같다.

$$
\hat{\beta}_{\mathcal{E}}
=
\left(X_{\mathcal{E}}^{T} X_{\mathcal{E}}\right)^{+}
\left(X_{\mathcal{E}}^{T} y - \lambda s\right), \quad \quad
\hat{\beta}_{-\mathcal{E}}=0
$$

또한 $X\in \mathbb{R}^{n\times p}$의 모든 원소를 $\mathbb{R}^{np}$에서 어떤 연속 확률분포를 따르며 i.i.d.(independent and indentically distributed)로 뽑으면 column 벡터들은 거의 확실하게 general position이고 따라서 해가 거의 항상 유일해지게 된다.


---

## Lagrange dual interpretation

본 포스트에서는 **Strong duality**에 대한 충분조건으로 **Slater's condition**을 제시했다. <br>
이 파트에서는 **Lagrange dual function**과 **primal / dual optimal value**에 대해 Stephen Boyd 교수님의 [Convex Optimization: Duality (Stanford, EE364a)](https://web.stanford.edu/class/ee364a/lectures/duality.pdf)를 참고해 추가적인 해석을 진행한다.

