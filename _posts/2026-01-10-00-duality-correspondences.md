---
layout: post
title: "[Convex Optimization] 13. Duality uses and correspondences"
description: "Duality의 활용법 및 primal-dual 간의 대응 관계 파악"
date: 2026-01-10 21:00:00 +0900
tags: [math, study]
categories: [optimization]
related_posts: True
toc:
  sidebar: left
---

## Introduction
<br>

이 포스트에서는 **Duality**의 활용 예시들과 **Primal-Dual** 간의 대응 관계를 살펴본다.

---

## Uses of Duality


1. **Duality gap**은 **optimality**를 판단하고 **stopping criterion**으로써 사용될 수 있다.<br>
Primal feasible $x$와 Dual feasible $u, v$에 대해 다음이 성립한다.

$$
f(x)- f^{\ast} \le f(x)-g(u, v)
$$

2. **Duality**는 **dual solution**으로부터 **primal solution**을 도출하거나 특징을 알기 위해 사용될 수 있다.<br>
**Strong duality**가 성립한다면 구해진 dual optimal $u^{\ast}, v^{\ast}$에 대해 아래 식의 solution은 **primal solution** $x^{\ast}$가 된다.

$$
\min_{x}L(x, u^{\ast}, v^{\ast})
$$

### When is dual easier?

**Primal-dual** 관계에는 다음과 같은 중요한 사실들이 있으며 후에 더 깊게 알아볼 것이다. 아래 관계를 이용해 언제 **primal problem**을 **dual problem**으로 변환하는 것이 더 풀기 쉽게 되는지 알 수 있다.
<br>

- **Number of dual variables = Number of primal constraints**
<br>

- Primal problem의 목적함수/제약에 등장하는 norm의 **dual norm**이 **dual problem**에 등장한다. : $\Vert \cdot \Vert$와 $\Vert \cdot \Vert_{\ast}$
<br>

- Dual problem은 primal problem과 동일한 **smoothness**를 가진다 : $L/m$ (gradient의 Lipscitz 상수와 strong convexity parameter의 비(**condition number**)는 $f$와 conjugate $f^{\ast}$에서 동일하다.)
<br>

- Dual problem으로 변환 시 **선형 연산자**의 위치를 다른 항으로 **shift** 할 수 있다.
<br>

### Solving the primal via the dual

**Strong duality**를 만족하는 상황에서 **stationarity**의 다음 식에 구해진 dual solution $u^{\ast}, v^{\ast}$를 대입하면 primal solution $x^{\ast}$는 해당 식의 solution이 된다.

$$
\min_{x} \ \  f(x) + \sum^{m}_{i=1}u^{\ast}_{i}h_{i}(x) + \sum^{r}_{j=1}v^{\ast}_{j}l_j (x)
$$

때로 이 **unconstrained problem**의 해는 명시적으로 표현할 수 있고 dual solution으로부터 primal solution의 **explicit characterization**을 얻을 수 있다.<br>
만약 이 문제의 해가 **unique**하다면 그 solution은 반드시 $x^{\ast}$가 된다. **Dual problem**이 **primal problem**보다 쉬울 때 이건 매우 큰 장점이 된다.
<br>
<br>

**Example**
<br>

다음과 같은 문제를 보자. $f_i(x_i)=\frac{1}{2}c_i x^{2}_i$ (smooth and strictly convex)이다.

$$
\min_{x} \; \sum_{i=1}^{n} f_i(x_i)
\quad \text{subject to} \quad
a^{T} x = b
$$

이 문제에 대한 dual function은

$$
\begin{aligned}
g(v)
&= \min_{x} \bigl(\sum_{i=1}^{n} f_i(x_i) + v(b - a^{T}x) \bigr)\\[0.8em]
&= b v + \sum_{i=1}^{n} \min_{x_i} \{ f_i(x_i) - a_i v x_i \} \\[0.8em]
&= b v - \sum_{i=1}^{n} f_i^{\ast}(a_i v)
\end{aligned}
$$

위 식에서 $f^{\ast}(y)= \frac{1}{2c_{i}}y^2$이다.
<br>
Dual problem은 

$$
\max_{v}\; \bigl(b v - \sum_{i=1}^{n} f_i^{\ast}(a_i v)
\bigr) \;\Longleftrightarrow\;
\min_{v}\; \bigl( \sum_{i=1}^{n} f_i^{\ast}(a_i v) - b v \bigr)
$$

이 바뀐 문제는 scalar variable $v$에 대한 문제가 된다. 따라서 primal보다 훨씬 풀기 쉽다.<br>
구한 $v^{\ast}$를 이용해 다음 식의 solution으로 $x^{\ast}$를 구할 수 있다.

$$
\min_{x}\;\sum^{n}_{i=1}\bigl( f_i(x_i)-a_i v^{\ast} x_i\bigr)
$$

주어진 $f_i$가 strictly convex function이었기 때문에 해당 방법으로 구한 $x^{\ast}$는 unique solution이 된다.<br>
$f'_{i}=a_i v^{\ast}$이므로 primal solution은 $x^{\ast}_i=a_i v^{\ast}/c_i$이다.

## Dual Norms

General norm은 $\Vert x \Vert$로 표시된다. 예시로는 $x\in \mathbb{R}^n$와 $\text{rank} (X)=r$인 matrix $X$에 대해

$$
\|x\|_{p}
=
\left( \sum_{i=1}^{n} |x_i|^{p} \right)^{\frac{1}{p}}
\quad \text{represents the } \ell_p \text{ norm for all } p \ge 1
$$

$$
\|X\|_{tr}
=
\sum_{i=1}^{r} \sigma_i(X)
\quad \text{represents the trace norm of a matrix, the sum of its singular values}
$$

**Definition**<br>
$x$에 대한 **Dual norm**은 다음과 같이 표현된다.

$$
\Vert x \Vert_{\ast}=\max_{\Vert z \Vert \le 1} z^{T} x
$$

일반적인 $y$에 대해 norm 정규화하고 식을 정리하면

$$
\frac{1}{\Vert y\Vert}\vert y^{T} x \vert \le  \Vert x \Vert_{\ast} \quad \Rightarrow \quad \vert y^{T} x \vert \le \Vert y\Vert \Vert x \Vert_{\ast} 
$$

이는 generalized [Hölder's inequality](https://en.wikipedia.org/wiki/H%C3%B6lder%27s_inequality)라고 볼 수 있다.
<br>
대표적인 **dual norms**은 다음과 같다.
<br>
- $\ell_p$ **norm dual**:

$$
(\Vert x \Vert_p)_{\ast}=\Vert x \Vert_q, \ \text{where} \; \frac{1}{p} + \frac{1}{q}=1
$$

- **Trace norm dual**:

$$
(\|X\|_{tr})_{\ast}=\Vert X \Vert_{op} = \sigma_1 (X)
$$

이중에 $\ell_p$ norm의 dual은 다음과 같이 구해진다. $\Vert y \Vert_p \le 1$인 경우 **Hölder's inequality**에 의해

$$
\vert y^T x \vert \le \Vert y \Vert_p \Vert x \Vert_q\le \Vert x \Vert_q.
$$

따라서 

$$
\Vert x \Vert_{\ast}=\sup_{\Vert y \Vert_p \le 1} \; \vert y^{T}x\vert \le \Vert x \Vert_q.
$$

여기서 

$$
y_i^{\ast}
=
\frac{|x_i|^{\,q-1}\,\operatorname{sign}(x_i)}
{\|x\|_{q}^{\,q-1}}
$$

이면 $\Vert y^{\ast} \Vert_p=1$, $(y^{\ast})^Tx=\Vert x \Vert_q$가 성립해 **상계**를 도달하는 해가 존재함을 알 수 있다.<br>
따라서

$$
\Vert x \Vert_{\ast}=\Vert x \Vert_q.
$$

### Dual norm of dual norm

**Theorem**
<br>
Dual of dual norm은 $\Vert x \Vert_{\ast \ast}=\Vert x \Vert$이다.
<br>

**Proof**<br>
다음과 같은 문제를 생각해보자.

$$
\min_y \; \Vert y \Vert \quad \text{subject to } \;y=x
$$

위 문제의 **optimal value**는 당연히 $\Vert x \Vert$다. **Lagrangian**을 취해보면

$$
L(y, u)= \Vert y \Vert + u^T (x-y) = \Vert y \Vert - y^T u + x^T u.
$$

**Hölder's inequality**에 의해 $y^T u \le \Vert y \Vert \Vert u \Vert_{\ast}$이다.<br> 
- 먼저 $\Vert u \Vert_{\ast} \le 1$인 경우에

$$
y^T u \le \Vert y \Vert \Vert u \Vert_{\ast} \le \Vert y \Vert
$$

$\quad \quad\; \;$따라서

$$
\min_{y}\lbrace \Vert y \Vert -y^{T}u \rbrace = 0
$$

- $\Vert u \Vert_{\ast} \gt 1$인 경우에 해당 u 방향으로 갈수록 $-\infty$로 가게 되므로

$$
\min_{y}\lbrace \Vert y \Vert -y^{T}u \rbrace = -\infty
$$

결론적으로 **Lagrange dual problem**은

$$
\max_{u} (u^{T}x) \quad \text{subject to } \; \Vert u \Vert_{\ast} \le 1
$$

**Primal problem**의 **strong duality**에 의해 $f^{\star}=g^{\star}$이다.<br>
**Lagrange dual problem**의 optimal value는 $\Vert x \Vert_{\ast \ast}$이고 primal optimal value는 $\Vert x \Vert$였으니 다음이 성립한다.

$$
\Vert x \Vert = \Vert x \Vert_{\ast \ast}
$$

## Conjugate function

$f\;:\; \mathbb{R}^{n} \rightarrow \mathbb{R}$에 대해 **conjugate** $f^{\ast}\;:\; \mathbb{R}^{n} \rightarrow \mathbb{R}$는 다음과 같이 정의된다.

$$
f^{\ast}(y)=\max_{x}(y^T x - f(x))
$$

$f^{\ast}$는 $y$의 convex function들의 **pointwise maximum**이므로 $f^{\ast}$는 항상 convex function이다.<br>
($f$의 convexity와 상관없이.)

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/conjugatefuncpic.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Illustration of the conjugate for a function.<br>
    (from B&V page 91)
</div>
<br>

그림을 보면 알 수 있듯이 linear function $y^{T}x$와 function $f$의 **maximum difference**를 의미한다. <br>
**Differentiable** $f$에 대한 conjugation은 **Legendre transform**이라 부른다.
<br>

**Properties**<br>

- Fenchel;s inequality: 