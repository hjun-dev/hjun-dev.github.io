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
$$
\begin{aligned}
\min_{x} \quad 
& f(x) \\[0.5em]
\text{subject to} \quad
& h_i(x) \le 0, \qquad i = 1,\ldots,m, \\
& \ell_j(x) = 0, \qquad j = 1,\ldots,r.
\end{aligned}
$$

위 primal problem에 대한 Lagrangian은 $L(x,u,v)=f(x)+\sum^{m}_{u=1}u_{i}h_{i}(x)+\sum^{r}_{j=1}v_{j}\ell_{j}(x)$이며 Lagrange dual function은 $g(u,v)=\min_{x}L(x,u,v)$로 정의된다.<br>

**Dual problem**
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

1. $0\in \partial_x \bigl(f(x)+\sum^{m}_{i=1}u_{i}h_{i}(x)+\sum^{r}_{j=1}v_j \ell_j(x)\bigr)$ (**Stationary**)
<br>

2. $u_i \cdot h_i (x) = 0$ for all $i$
(**Complementary slackness**)
<br>

3. $h_i (x) \le 0, \ell_j (x) =0$ for all $i, j$ (**Primal feasibility**)
<br>

4. $u_i \ge 0$ for all $i$ (**Dual feasibility**)

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
$t\in \mathbb{R}$와 $\lambda \ge 0$에 대해 $f, h$가 convex function이고 constrained form이 strictly feasible이라면 아래의 두 forms는 동일하다.
<br>

**Proof**<br>


---

## Lagrange dual interpretation

본 포스트에서는 **Strong duality**에 대한 충분조건으로 **Slater's condition**을 제시했다. <br>
이 파트에서는 **Lagrange dual function**과 **primal / dual optimal value**에 대해 Stephen Boyd 교수님의 [Convex Optimization: Duality (Stanford, EE364a)](https://web.stanford.edu/class/ee364a/lectures/duality.pdf)를 참고해 추가적인 해석을 진행한다.

