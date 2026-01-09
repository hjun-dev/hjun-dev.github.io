---
layout: post
title: "[Convex Optimization] 11. Duality in General Programs"
description: "General Programs에서 Lagrangian 정의 및 Duality gap 분석"
date: 2026-01-06 15:00:00 +0900
tags: [math, study]
categories: [optimization]
related_posts: True
toc:
  sidebar: left
---

## Introduction
<br>

본 챕터에서는 **General Programs**에 대한 **Lagrangian**를 정의하고 **Duality Gap**에 대한 분석을 진행한다.   

---

## Lagrangian
<br>

일반적인 Minimization problem의 형태는 다음과 같다. (can be nonconvex)

$$
\begin{aligned}
\min_{x} \quad & f(x) \\[0.5em]
\text{subject to} \quad
& h_i(x) \le 0, \qquad i = 1,\ldots,m, \\
& l_j(x) = 0, \qquad j = 1,\ldots,r.
\end{aligned}
$$

위 문제에 대한 **Lagrangian function**은 $u\in \mathbb{R}^m \ge 0, v \in \mathbb{R}^r$에 대해 다음과 같이 정의된다.

$$
L(x,u,v)
= f(x)
+ \sum_{i=1}^{m} u_i \,\underbrace{h_i(x)}_{\le 0}
+ \sum_{j=1}^{r} v_j \,\underbrace{l_j(x)}_{= 0}
$$

$u \le 0$에 대해서는 $L(x,u,v) \rightarrow -\infty$이다.  
Lagrangian의 **중요한 특징** 중 하나는 모든 $u\ge 0$와 $v$에 대해 각 feasible $x$에서 $f(x)\ge L(x,u,v)$가 성립한다는 것이다. 
<br>
$f$와 $L(x,u,v)$의 관계는 feasible set 밖에서는 적용되지 않음에 주의하자.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/lagrangian00.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    A one dimension optimization problem.
</div>
<br>

위 그림에서 solid line은 $f$이며 dashed line은 $h$이다. 각 dotted line은 $u\ge 0$에 따라 달라지는 $L(x,u,v)$를 나타낸다.  
그림을 보면 feasible set 내에서만 라그랑지안이 원함수보다 작거나 같은 것을 확인할 수 있다.
<br>

---

### Lagrange dual function
<br>

$C$를 primal feasible set으로 두고 $f^{\star}$를 primal optimal value로 둔다.<br> 
그럼 $L(x,u,v)$를 전체 $x$에서 minimize하는 것은 **lower bound**를 제공한다.

$$
f^\star
\;\ge\;
\min_{x \in {C}} {L}(x,u,v)
\;\ge\;
\min_{x} {L}(x,u,v)
\;:=\;
g(u,v)
$$

우리는 이 $g(u,v)$를 **Lagrange dual function**이라고 부른다. 
$g(u,v)$는 모든 $u\ge 0$와 $v$에서 $f^{\star}$의 **lower bound**를 제공한다.  
(이 $u\ge 0$와 모든 $v$를 **dual feasible** $u$와 $v$라고 부른다.)
<br>

**Nonconvex problem**에 대해서는 $f^\star
\ge\min_{x \in {C}} {L}(x,u,v)$의 식의 부등호가 strictly inequality가 될 수도 있다.<br>
또한 $\min_{x\in C}L(x,u,v) \ge \min_{x}L(x,u,v)$에 대해서 $u=0$이면 $g(u,v)$는 tight lower bound를 제공하고 $u \ne 0$라면 일반적으로는 duality가 tight하지 않다.<br>

---

## Example: Quadratic Program

$Q \succ0$인 QP를 하나 생각해보자.

$$
\begin{aligned}
\min_{x} \quad 
& \frac{1}{2}\,x^{T}Qx + c^{T}x \\[0.5em]
\text{subject to} \quad
& Ax = b, \\
& x \ge 0.
\end{aligned}
$$

이 문제의 Lagrangian은 다음과 같다.

$$
L(x,u,v) = \frac{1}{2}x^T Qx + c^T x - u^T x + v^T (Ax-b)
$$

Lagrange dual function $g$를 구하기 위해서 Lagrangian의 gradient를 0으로 만드는 $x^{\star}$를 찾는다.    

$$
\nabla_x L(x^{\star},u,v)
= Qx^{\star} + c - u + A^T v = 0
$$

$$
x^{\star} = -Q^{-1}(c-u+A^T v)
$$

이를 다시 Lagrangian에 대입해 Lagrange dual function을 구한다.

$$
g(u,v)
= \min_{x} L(x,u,v)
= -\frac{1}{2}
\bigl(c - u + A^{T}v\bigr)^{T}
Q^{-1}
\bigl(c - u + A^{T}v\bigr)
- b^{T}v
$$

이 function은 모든 $u\ge 0$과 $v$에 대해서 $f^{\star}$의 **lower bound**를 만족한다.
<br>

<br>
마찬가지로 QP지만 이번엔 $Q\succeq 0$인 경우에 대해서 살펴보겠다.   
문제 설정은 기존 QP와 동일하다.

$$
\begin{aligned}
\min_{x} \quad 
& \frac{1}{2}\,x^{T}Qx + c^{T}x \\[0.5em]
\text{subject to} \quad
& Ax = b, \\
& x \ge 0.
\end{aligned}
$$

따라서 Lagrangian도 동일하다.

$$
L(x,u,v) = \frac{1}{2}x^T Qx + c^T x - u^T x + v^T (Ax-b)
$$

Lagrangian의 그래디언트가 0이 되는 곳을 찾으면 마찬가지로 $Qx=(-c-u+A^T v)$이다.    
하지만 $Q$가 positive semidefinite이라 역행렬이 정의되지 않을 수 있다.
<br>
만약 $(c-u+A^T v) \in \text{col}(Q)$라면 ($Q \in \mathbb{S}$이므로 $(c-u+A^T v) \perp \text{null}(Q)$와 동치) 라그랑지안을 0으로 만드는 해는 무수히 많고 이는 pseudo inverse로 구할 수 있다. <br>(pseudo inverse는 [Moore-Penrose inverse](https://en.wikipedia.org/wiki/Moore%E2%80%93Penrose_inverse)라고도 부른다.)    

$$
\begin{aligned}
x^{\star} = Q^+(-c-u+A^T v)
\end{aligned}
$$

$$
\begin{aligned}
g(u,v)=L(x^{\star},u, v)= -\frac{1}{2}
\bigl(c - u + A^{T}v\bigr)^{T}
Q^{+}
\bigl(c - u + A^{T}v\bigr)
- b^{T}v
\end{aligned}
$$

위의 경우가 아닌 경우 해당 라그랑지안의 **minimizer**는 존재하지 않는다. 따라서 Lagrange dual function의 값은 $-\infty$이다.    

$$
g(u,v)
=
\begin{cases}
-\dfrac{1}{2}
\bigl(c - u + A^{T}v\bigr)^{T}
Q^{+}
\bigl(c - u + A^{T}v\bigr)
- b^{T}u
& \text{if } c - u + A^{T}v \perp \mathrm{null}(Q), \\[0.8em]
-\infty
& \text{otherwise}.
\end{cases}
$$

<br>

---

### Lagrange dual problem

다음의 일반적인 **primal problem**을 가정하자. 

$$
\begin{aligned}
\min_{x} \quad 
& f(x) \\[0.5em]
\text{subject to} \quad
& h_i(x) \le 0, \qquad i = 1,\ldots,m, \\
& l_j(x) = 0, \qquad j = 1,\ldots,r.
\end{aligned}
$$

이전에 말한 것처럼 모든 $u\ge 0$과 $v$에 대해서 $f^{\ast}\ge g(u,v)$를 만족한다. <br>따라서 우리는 Lagrange dual function을 maximize함으로써 가장 유의미한 lower bound를 구할 수 있다.   

$$
\begin{aligned}
\max_{u,v} \quad 
& g(u,v) \\[0.5em]
\text{subject to} \quad
& u \ge 0.
\end{aligned}
$$

위 Lagrange dual function에 대한 문제를 **dual problem**이라고 하며 optimal value를 $g^{\ast}$라고 한다. $f^{\ast}\ge g^{\ast}$가 만족하며 이를 **weak duality**라고 부른다. 이 특징은 primal nonconvex 문제에서도 항상 성립한다.   

두 번째 주요한 특징은 **dual problem**은 항상 **convex optimization problem**이라는 것이다.<br>
Lagrange dual function의 형태를 보면 다음과 같다.

$$
\begin{aligned}
g(u,v)
&= \min_{x}
\left\{
f(x)
+ \sum_{i=1}^{m} u_i h_i(x)
+ \sum_{j=1}^{r} v_j l_j(x)
\right\} \\[0.6em]
&= - \max_{x}
\left\{
- f(x)
- \sum_{i=1}^{m} u_i h_i(x)
- \sum_{j=1}^{r} v_j l_j(x)
\right\}
\end{aligned}
$$

중괄호 내부의 식을 보면 특정 $x$를 고정하면 $u$와 $v$에 대해 **affine(convex) function**이므로 convex function의 특징인 **pointwise maximum**이 적용되어 max function을 포함한 식은 **convex function**이 된다. <br> 
$(-)$ 부호를 곱해 convex function이면 원함수는 concave function이므로 $g(u,v)$는 **concave function**이다. <br> 
또한 제약조건 $u\ge 0$는 **convex set**이므로 dual problem은 **concave maximization problem**이고 이는 **convex optimization problem**으로 변환할 수 있다.  

---

### Example: non-convex quadratic minimization

다음과 같은 **optimization problem**을 보자.

$$
\begin{aligned}
\min_{x} \quad & x^{4} - 50x^{2} + 100x \\
\text{subject to} \quad & x \ge -4.5.
\end{aligned}
$$

Objective function이 nonconvex이므로 **nonconvex problem**이다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/nonconvexmini.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    (a) Primal objective function<br>
    (b) Dual objective function
</div>

Lagrangian의 그래디언트를 0으로 만드는 해는 3개 존재한다. 따라서 이 해들을 $u$에 대한 함수로 나타낸 뒤 3가지 해 중 Lagrangian을 가장 작게 만드는 해를 대입한 값이 $g(u)$가 된다.

$$
g(u)
=
\min_{i=1,2,3}
\left\{
F_i^{4}(u) - 50 F_i^{2}(u) + 100 F_i(u) -u (F_i(u)+4.5)
\right\}.
$$

$$
\begin{aligned}
F_i(u)
&=
\frac{-a_i}{12\cdot 2^{1/3}}
\left(
432(100-u)
-
\Bigl(432^{2}(100-u)^{2}-4\cdot1200^{3}\Bigr)^{1/2}
\right)^{1/3} \\[0.8em]
&\quad
-\,100\cdot 2^{1/3}
\frac{1}{
\left(
432(100-u)
-
\Bigl(432^{2}(100-u)^{2}-4\cdot1200^{3}\Bigr)^{1/2}
\right)^{1/3}
},
\qquad i=1,2,3.
\end{aligned}
$$

$$
a_1 = 1,
\qquad
a_2 = \frac{-1 + i\sqrt{3}}{2},
\qquad
a_3 = \frac{-1 - i\sqrt{3}}{2}.
$$

해당 **dual function**은 직관적으로 concave인지 눈치채기 힘들다. <br>
하지만 우리는 $g(u)$가 **특정 primal problem**의 **dual function**인 것을 알기에 $g(u)$가 **concave function**인 것을 알 수 있다.

---

## Strong Duality

이전에 말한 $f^{\ast}\ge g^{\ast}$ 특징에서 더 나아가 만약 $f^{\ast}=g^{\ast}$한 특징을 가진다면 이를 **strong duality**라고 부른다.    <br>

**Slater's condition**<br>
Primal problem이 convex이고, 목적함수 $f$와 모든 부등식 제약 함수 $h_i$ ($i \in [1,m]$)가 convex이며, 모든 등식 제약 함수 $\ell_j$ ($j \in [1,r]$)가 affine라고 하자.<br>
이때 $\mathbb{R}^n$ 상에서 **적어도 하나의 엄밀한 내부 feasible point** $x$가 존재(모든 $i \in [1,m]$, $j \in [1,r]$에 대해 $h_i(x) \lt0, \ell_j(x)=0$를 만족하는 $x$가 존재)한다면 **strong duality**가 성립한다.<br>
$h_i$에 대한 strict inequality 제약은 $h_i$가 **affine**인 경우는 필요하지 않다.

---

### Example: support vector machine dual

$y\in \{-1, 1\}^{n}$, $X\in \mathbb{R}^{n\times p}$에 대해 support vector machine problem은 다음과 같이 표현된다.

$$
\begin{aligned}
\min_{\beta,\,\beta_0,\,\xi} \quad
& \frac{1}{2}\,\lVert \beta \rVert_2^2
+ C \sum_{i=1}^{n} \xi_i \\[0.5em]
\text{subject to} \quad
& \xi_i \ge 0, \qquad i = 1,\ldots,n, \\
& y_i\bigl(x_i^{T}\beta + \beta_0\bigr)
\ge 1 - \xi_i,
\qquad i = 1,\ldots,n.
\end{aligned}
$$

Dual variables $v$, $w\ge 0$에 대해 Lagrangian은 다음과 같다.

$$
\begin{aligned}
{L}(\beta,\beta_0,\xi,\nu,w)
&= \frac{1}{2}\,\lVert \beta \rVert_2^2
+ C \sum_{i=1}^{n} \xi_i
- \sum_{i=1}^{n} \nu_i \xi_i \\
&\quad
+ \sum_{i=1}^{n} w_i
\bigl(1 - \xi_i - y_i(x_i^{T}\beta + \beta_0)\bigr).
\end{aligned}
$$

Lagrangian을 $\beta, \beta_0, \xi$에 대해 최소화하면

$$
g(u,v)
=
\begin{cases}
-\dfrac{1}{2}\, w^{T}\,\tilde{X}\,\tilde{X}^{T} w
+ \mathbf{1}^{T} w,
& \text{if } C\mathbf{1} - \nu = 0,\; w^{T}y = 0, \\[0.6em]
-\infty,
& \text{otherwise}.
\end{cases}
$$

$\tilde{X}=\text{diag}(y)X$이다. 따라서 SVM의 dual problem은 **slack variable** $v$를 제거하면 다음과 같이 나타난다.

$$
\begin{aligned}
\max_{w} \quad
& -\frac{1}{2}\, w^{T}\tilde{X}\tilde{X}^{T} w
+ \mathbf{1}^{T} w \\[0.5em]
\text{subject to} \quad
& 0 \le w \le C\,\mathbf{1}, \\
& w^{T} y = 0.
\end{aligned}
$$

Primal problem은 Slater's condition을 만족하므로 **strong duality**를 가지는 것을 알 수 있다. <br>또한 dual function을 구할 때 찾은 $\beta=\tilde{X}^T w$은 SVM의 연구들에서 발견된 최적해의 조건과 동일한 것이 확인된다.

---

## Duality Gap

Primal $x$와 feasible한 dual $u, v$에 대해 다음을 **duality gap** 이라 부른다. 

$$
f(x)-g(u, v)
$$

또한 $f^{\ast}$와 $g(u,v)$의 관계에 의해 다음이 성립한다.

$$
f(x)-f^{\ast}\le f(x)-g(u,v)
$$

따라서 duality gap이 0이면 primal optimal과 dual optimal이 그 지점의 $x$와 $(u,v)$가 되는 것을 알 수 있다.<br>
알고리즘적 관점에서는 $f(x)-g(u,v)\le \epsilon$이 $f(x)-f^{\ast}\le \epsilon$을 보장하므로 종료조건으로 활용가능하다.