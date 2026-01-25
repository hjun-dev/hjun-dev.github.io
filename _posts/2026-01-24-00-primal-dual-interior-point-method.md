---
layout: post
title: "[Convex Optimization] 16. Primal-dual interior-point methods"
description: "Inequality and equality constrained problem을 효율적으로 풀기 위한 핵심 2nd order method인 Primal-dual interior-point method의 정의 및 분석"
date: 2026-01-24 13:00:00 +0900
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

이 포스트에서는 Second-order method의 interior point method 중 하나인 **Primal-dual interior-point method**를 알아볼 것이다. 이전에 다룬 barrier method와 비교해 더 빠르고 더 높은 정확도를 가진다.

---

## Last time: barrier method

Primal-dual interior-point method를 보기 전에 이전 포스트에서 다룬 barrier method를 다시 보고 넘어가자.<br>

다음과 같은 일반적인 convex optimization 문제를 보자.

$$
\begin{aligned}
\min_{x}\quad & f(x) \\
\text{subject to}\quad & h_i(x) \le 0,\quad i = 1,\ldots,m \\
& Ax = b
\end{aligned}
$$

여기서 $f, h_1, h_2, \dots, h_m$는 **convex, twice differentiable**이며 **strong duality**가 성립한다.<br>

해당 문제에 대한 log barrier problem은 아래와 같다.

$$
\begin{aligned}
\min_{x}\quad & t f(x) + \phi(x) \\
\text{subject to}\quad & Ax = b
\end{aligned}
$$

여기서 $\phi$는 **log barrier function**이다.

$$
\phi(x) = - \sum_{i=1}^{m} \log\bigl(-h_i(x)\bigr)
$$

$x^{\star}(t)$는 특정 $t \gt 0$에 대한 barrier problem의 solution이고 $f^{\star}$가 원 문제의 optimal value라고 하면 다음이 성립한다.

$$
f(x^{\star}(t))-f^{\star} \le m/t
$$

또한 duality gap은 $m/t$임을 보일 수 있다.<br>

Barrier method는 Barrier problem에 대해 $t\gt 0$을 증가시켜가며 $m/t \le \epsilon$을 만족할 때까지 푸는 알고리즘이다.
<br>

**Barrier method**의 구체적인 알고리즘은 다음과 같다.

1. Initialize $t^{(0)}\gt 0, \mu \gt 0$. Solve the minimization problem to get $x^{(0)}=x^{\star}(t^{(0)})$

2. For $k=1,2,3,\ldots$ <br>
    
    $(a)$ Compute $t^{(k)}=\mu t^{(k-1)}$<br> 
    $(b)$ Solve minimization problem using Newton's method initialized at $x^{(k-1)}$ to get $x^{(k)}=x^{\ast}(t^{(k)})$<br>
    $(c)$ if $m/t \le \epsilon$ break

---

## Barrier versus primal-dual method

오늘 다룰 primal-dual interior-point method는 본질적으로 barrier method와 동일한 문제를 푼다. 그럼 뭐가 다른걸까?
<br>

**Overview:**

- 둘 모두 perturbed KKT conditions에서 나왔다.

- Primal-dual interior-poin methods는 매 iteration마다 한 Newton step을 사용하며 inner & outer loop로 나뉘지 않는다.

- Primal-dual interior-point iterates는 feasible하지 않을 수 있다.

- Primal-dual interior-point methods는 자주 더 효율적이며 linear convergence보다 더 좋은 수렴 속도를 가질 수 있다.

- Primal-dual interior-point methods는 대신 덜 직관적이다.

---

## Perturbed KKT conditions

Barrier method와 primal-dual interior-point method는 모두 perturbed KKT conditions로부터 나온다. 이를 자세히 살펴보자.

---

### Perturbed KKT conditions

Barrier method에서 central path의 $(x^{\star}(t), u^{\star}(t),v^{\star}(t))$는 아래의 perturbed KKT conditions를 만족한다.

$$
\begin{aligned}
&\nabla f(x)+\sum_{i=1}^m u_i\nabla h_i(x)+A^T v=0\\
&u_i h_i(x)=-\frac{1}{t},\quad i=1,\ldots,m\\
&h_i(x)\lt 0,\quad i=1,\ldots,m,\quad Ax=b\\
&u_i\gt 0,\quad i=1,\ldots,m
\end{aligned}
$$

원 문제의 KKT conditions와 가장 다른 점은 두 번째 줄이다. 원 문제의 경우 $u_i h_i(x) = 0$의 complementary slackness가 성립한다.

---

### Perturbed KKT as nonlinear system

Perturbed KKT를 다음과 같은 nonlinear system으로 볼 수 있다.

$$
r(x,u,v)=
\begin{pmatrix}
\nabla f(x)+Dh(x)^T u + A^T v\\
-\operatorname{diag}(u)h(x)-\frac{1}{t}\mathbf{1}\\
Ax-b
\end{pmatrix}
=0
$$

여기서 

$$
h(x)=
\begin{pmatrix}
h_1(x)\\
\vdots\\
h_m(x)
\end{pmatrix},
\qquad
Dh(x)=
\begin{pmatrix}
\nabla h_1(x)^T\\
\vdots\\
\nabla h_m(x)^T
\end{pmatrix}
$$

Newton's method를 이용해 non-linear system $F(y)=0$에 대해 root-finding을 진행한다. $F(y+\Delta y ) \simeq F(y) + DF(y) \Delta y$로 근사하며

$$
\Delta y = -(DF(y))^{-1}F(y)
$$

반복하여 $r(x,u,v)=0$을 만족하는 해를 찾는다. 구체적인 방법은 아래와 같다.

---

### Newton on perturbed KKT, v1

먼저 barrier method에서 등장한 perturbed KKT conditions을 떠올려보자. 여기서 $u_i$는 원 문제의 KKT conditions와의 대응을 위해 도입된 기호지만 barrier problem 자체에는 inequality constraint에 대한 dual bariable이 본질적으로 필요하지 않다.<br>
Perturbed complementary slackness 조건에 따라

$$
u_i = -\frac{1}{t h_i(x)}
$$

가 유도된다. 따라서 barrier method (v1)에서는 $u_i$를 독립적인 변수로 두지 않고 $x$에 대한 함수로 제거하여 다룬다.<br>
이와 같이 $u_i$를 제거하면 perturbed KKT conditions는 다음과 같은 $(x,v)$에 대한 non-linear system으로 나타난다.


$$
r(x,v)=
\begin{pmatrix}
\nabla f(x)
-\displaystyle\sum_{i=1}^m \frac{1}{t\,h_i(x)}\,\nabla h_i(x)
+ A^T v\\[4pt]
Ax-b
\end{pmatrix}
=0
$$

이에 대한 Newton root-finding update $(\Delta x, \Delta v)$는 다음의 solution으로 결정된다.

$$
\begin{pmatrix}
H_{\mathrm{bar}}(x) & A^T\\
A & 0
\end{pmatrix}
\begin{pmatrix}
\Delta x\\
\Delta v
\end{pmatrix}
=
-\,r(x,v)
$$

여기서 $H_{\mathrm{bar}}(x)=\nabla^2 f(x) + \sum^m_{i=1} \frac{1}{th_i(x)^2}\nabla h_i(x) \nabla h_i(x)^{T} + \sum^m_{i=1}(-\frac{1}{th_i(x)})\nabla^2 h_i(x)$

이 과정은 barrier method에서 고정된 $t$에 대한 다음의 barrier subproblem을 푸는 과정에서 사용되는 centering step의 Newton iteration과 정확히 같다.

$$
\min_{x}\; t f(x)+\phi(x)\quad \text{s.t.}\; Ax=b
$$

따라서 $r(x,v)=0$을 만족하는 해 $(x^{\star}(t), v^{\star}(t))$는 해당 $t$에 대한 barrier problem의 해이며 $x^{\star}(t)$는 $t$에 따라 central path를 이룬다.

---

### Newton on perturbed KKT, v2

v1과 달리 이번엔 $u$를 제거하지 말고 새로운 변수로 보자.<br>
다음의 세 residual은 각각 $y=(x,u,v)$에서의 dual, central, and primal residual이라 부를 것이다.

$$
\begin{aligned}
r_{\text{dual}} &= \nabla f(x)+Dh(x)^{T}u+A^{T}v\\
r_{\text{cent}} &= -\operatorname{diag}(u)\,h(x)-\frac{1}{t}\mathbf{1}\\
r_{\text{prim}} &= Ax-b
\end{aligned}
$$

