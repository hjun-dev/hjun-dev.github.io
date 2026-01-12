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

---

### When is dual easier?
<br>

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

---

### Solving the primal via the dual
<br>

**Strong duality**를 만족하는 상황에서 **stationarity**의 다음 식에 구해진 dual solution $u^{\ast}, v^{\ast}$를 대입하면 primal solution $x^{\ast}$는 해당 식의 solution이 된다.

$$
\min_{x} \ \  f(x) + \sum^{m}_{i=1}u^{\ast}_{i}h_{i}(x) + \sum^{r}_{j=1}v^{\ast}_{j}l_j (x)
$$

때로 이 **unconstrained problem**의 해는 명시적으로 표현할 수 있고 dual solution으로부터 primal solution의 **explicit characterization**을 얻을 수 있다.<br>
만약 이 문제의 해가 **unique**하다면 그 solution은 반드시 $x^{\ast}$가 된다. **Dual problem**이 **primal problem**보다 쉬울 때 이건 매우 큰 장점이 된다.
<br>

---

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

---

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

---

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

---

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
**Differentiable** $f$에 대한 conjugation은 [Legendre transformation](https://en.wikipedia.org/wiki/Legendre_transformation)이라 부른다.
<br>

---

**Properties**<br>

- Fenchel's inequality: 

$$
f(x)+f^{\ast}(y) \ge x^{T}y, \quad \forall x,y
$$

- Conjugate of conjugate $f^{\ast \ast}$ satisfies $f^{\ast \ast}\le f$.<br>

- If $f$ is closed and convex, then $f^{\ast \ast}=f$ <br>

- If $f$ is closed and convex, then for any $x, y$,

$$
x \in \partial f^{\ast}(y)
\;\Longleftrightarrow\;
y \in \partial f(x)
\Longleftrightarrow\;
f(x) + f^{\ast}(y) = x^{T} y
$$

- If $f(u, v)=f_{1}(u) + f_{2}(v)$, then we can split it into a term-by-term conjugation:

$$
f^{\ast}(w,z)=f^{\ast}_1(w) + f^{\ast}_2(z)
$$
<br>

---

### Intuition of Conjugate

Fenchel conjugate의 작용은 계산적 정의보다 기하학적 관점에서 이해하는 것이 훨씬 직관적이라 생각한다.<br>
**Conjugate**은 원래의 함수를 직접 다루는 대신 해당 함수에 접할 수 있는 모든 **supporting hyperplane**들의 정보를 저장하는 변환으로 볼 수 있다.
<br>

---

**Differentiable convex case**<br>

먼저 **differentiable**한 convex function $f$를 생각해보자.<br>
고정된 $y$에 대해

$$
f^{\ast}(y)=\max_{x}(y^T x - f(x))
$$

를 만족하는 $\hat{x}$는 다음을 만족한다.

$$
\nabla f(\hat{x})=y
$$

즉, $y$가 주어지면 $y$를 기울기로 갖는 직선(평면)이 $f$에 접하는 지점 $\hat{x}$가 결정된다. 이때 해당 **supporting hyperplane**의 절편은 $-f^{\ast}(y)$가 된다. 이는 conjugate에서 제시한 예시 그림을 통해서도 확인할 수 있다.
<br>

이 관점에서 **conjugate**은 주어진 함수에 대해 기울기를 변화시키며 그릴 수 있는 모든 **supporting hyperplane**들의 **절편 정보**를 저장하는 변환으로 이해할 수 있다.<br>
Differentiable한 convex function의 경우 각 기울기 $y$에 대해 해당 기울기를 갖는 접점 $\hat{x}$가 유일하게 존재한다. 따라서 conjugate은 기울기 $y$를 입력으로 받아, 그 기울기를 갖는 접선이 함수에 접하는 위치와 그 절편을 대응시키는 변환으로 해석할 수 있다.<br>
즉, 함수의 값을 직접 다루는 대신 기울기-절편 관계를 통해 함수를 재표현하는 역할을 한다.
<br>

---

**Reconstruction intuition (conjugate to primal)** <br>

**Differentiable convex case**에서 살펴본 것처럼 conjugate은 함수를 각 기울기 $y$에 대해 해당 기울기를 갖는 **supporting hyperplane**의 절편 정보를 저장한다.<br>
이제 다시 원래 함수로 돌아오는 과정을 생각해보자.<br>
**Conjugate**을 한 번 더 적용하면 아래와 같다.

$$
f^{\ast\ast}(x)=\max_{y}(x^T y - f^{\ast}(y))
$$

이는 저장해 두었던 모든 **supporting hyperplane**들 중에서 주어진 $x$에서 **가장 큰 값을 만드는 hyperplane**을 선택하는 과정으로 이해할 수 있다.<br>

따라서 **double conjugate**은 기울기-절편 정보로 저장된 **모든 supporting hyperplane**을 다시 불러와 주어진 $x$에서 **가장 위**에 위치하는 것을 취하는 것이다.

---

**General convex (possibly nondifferentiable) case**<br>

이제 미분 불가능한 함수를 포함한 일반적인 convex function을 생각해보자. 미분 불가능한 점에서는 단일 gradient 대신 **subgradient**들의 집합인 **subdifferential**이 정의되며 모든 **subgradient**는 각각 하나의 **supporting hyperplane**을 정의하게 된다.<br>

따라서 **convex function**의 경우 conjugate은 미분 가능 여부 & strictly convexity 여부와 무관하게 모든 가능한 supporting hyperplane들의 **기울기-절편** 쌍을 전부 저장한다.<br>
이 때문에 $f$가 **closed convex function**이면 **conjugate**을 두 번 적용했을 때 다음 식이 성립하며 정보 손실 없이 원래 함수를 복원할 수 있다.

$$
f^{\ast \ast}=f
$$

---

**Nonconvex case and convex envelope**<br>

마지막으로 $f$가 **nonconvex function**인 경우를 생각해보자.<br>
Nonconvex 함수에서는 모든 점에서 **supporting hyperplane**이 존재하지 않을 수 있으며 동일한 기울기 $y$에 대해 여러 접점이 존재할 수 있다.<br>

Conjugate는 정의상

$$
f^{\ast}(y)=\max_{x}(y^T x - f(x))
$$

로 주어지므로 이러한 경우에도 오직 전역적으로 함수 아래에 위치할 수 있는 hyperplane들 중 가장 바깥쪽에 위치한 것만을 선택하게 된다.<br>
결과적으로 $f^{\ast}$에는 원래 함수의 모든 국소적 구조의 정보가 들어가지 못하고 **epigraph**를 감싸는 **convex envelope**를 구성하는 supporting hyperplane들의 정보만이 저장된다. 이전에 제시한 conjugate의 그림에서 $y$에 대한 **supporting hyperplane**을 그려보면 이를 확인 가능하다.<br>

따라서 nonconvex 함수에 대해 conjugate을 두 번 적용하면 

$$
f^{\ast \ast}=\text{cl conv}(f)
$$

가 되며 이는 원래 함수가 아닌 convex envelope를 갖는 함수로 복원됨을 의미한다.<br>
이를 통해 conjugation은 nonconvex 구조에 대해서는 정보 소실을 동반하게 됨을 알 수 있다.<br>

Conjugate의 property 중 **Fenchel's inequality**를 다시 보면 다음과 같다.

$$
f(x)+ f^{\ast}(y) \ge x^{T}y
$$

이 부등식을 이전에 다룬 intuition을 가지고 보면 모든 $y$에 대해 $x^{T}y - f^{\ast}(y)$가 $f$ 아래에 위치하는 **supporting hyperplane**임을 의미한다. <br>
또한 **equality**가 성립하는 경우는 해당 hyperplane이 실제로 함수에 접하는 경우인 $y \in \partial f(x)$를 의미하며 **closed convex function**의 경우 이러한 접촉이 가능한 supporting hyperplane이 존재해 등호가 성립하게 된다.

---

**Examples**

<br>

- **Simple quadratic**: 만약 $Q\succ 0$에 대해 $f(x)=\frac{1}{2}x^{T}Qx$라면 $y^{T}x - \frac{1}{2}x^{T}Qx$는 $x$에 대해 strictly concave하고 $x=Q^{-1}y$로 최대화된다. 따라서

$$
f^{\ast}(y)=\frac{1}{2}y^{T}Q^{-1}y
$$

- **Indicator function**: $f(x)=I_{C}(x)$라면 그 conjugate은 아래와 같으며 **support function** of $C$ 라고 부른다.

$$
f^{\ast}(y)=I^{\ast}_C (y)=\max_{x\in C} y^{T}x
$$

- **Norm**: $f(x)=\Vert x\Vert$라면 그 conjugate은

$$
f^{\ast}(y)=I_{\lbrace z : \Vert z \Vert_{\ast} \le 1 \rbrace}(y)
$$


**Proof of Norm conjugate**

$\max_{y}(z^{T}y-\Vert y \Vert)$를 만족하는 $z$는 Dual of dual norm 증명에서 쓰인 **Hölder's inequality** ($y^T z \le \Vert y \Vert \Vert z \Vert_{\ast}$)를 이용해 구할 수 있다.<br> 
$\max_{y}(z^{T}y-\Vert y \Vert)$는 $\Vert z \Vert_{\ast} \le 1$인 경우 0, $\Vert z \Vert_{\ast} \gt 1$인 경우 $\infty$이므로 아래와 같이 쓸 수 있다.

$$
\Vert y \Vert^{\ast}=I_{\lbrace z : \Vert z \Vert_{\ast} \le 1 \rbrace}(y)
$$


---

### Smoothness relatioin of primal and dual

$f:\mathbb{R}^{n} \rightarrow \mathbb{R}$가 twice differentiable하고 convex하다고 하자.<br>
최적화에서 smoothness와 strong convexity는 Hessian으로 다음과 같이 정의된다.<br>

- $f$가 $L$-smooth

$$
\nabla^{2}f(x) \preceq LI
$$

- $f$가 $\mu$-strongly convex

$$
\nabla^{2}f(x) \succeq \mu I
$$

Conjugate의 정의는 아래와 같다.

$$
f^{\ast}(y) = \max_{x}(y^T x - f(x))
$$

$f$가 twice differentiable & strictly convex라면 최적점 $x$는 $y=\nabla f (x)$를 만족하며 Hessian이 역함수를 가진다.<br>

양변을 미분하면

$$
dy = \nabla^{2}f(x)dx
$$

이고 

$$
dx = (\nabla^{2}f(x))^{-1}dy
$$

또한 $x=\nabla f^{\ast}(y)$이므로

$$
\frac{dx}{dy}=\nabla^2 f^{\ast}(y) =  (\nabla^{2}f(x))^{-1}
$$

가 된다.<br>
즉, conjugate에서는 Hessian이 역행렬로 변환된다.<br>
따라서 만약

$$
\mu I \preceq \nabla^2 f(x) \preceq L I
$$

라면 conjugate의 Hessian은

$$
\frac{1}{L}I \preceq \nabla^2 f(x) \preceq \frac{1}{\mu} I.
$$

따라서 정리하면 다음과 같다.<br>

- $f$가 $L$-smooth면 $f^{\ast}$는 $1/L$-strongly convex
<br>

- $f$가 $\mu$-strongly convex면 $f^{\ast}$는 $1/\mu$-smooth

---

### Example: Lasso Dual

이 예제는 **conjugate function**을 이용해서 dual problem을 만드는 예시를 보여준다.<br>
여기서는 objective function 특정 항의 선형 연산자를 **shifting**하는 유용한 **trick**을 사용한다.<br>

$y\in \mathbb{R}^n$, $X\in \mathbb{R}^{n\times p}$에 대해 아래와 같은 lasso problem을 보자.

$$
\min_{\beta} \quad \frac{1}{2}\Vert y-X\beta \Vert^{2}_{2} + \lambda \Vert \beta \Vert_{1}
$$

**Primal problem**은 **constraints**가 없는 문제이므로 dual variable을 만들기 위해 아래와 같이 보조 **(auxiliary) variables** ($z$)를 도입한다.

$$
\min_{\beta,\,z}
\quad
\frac{1}{2}\,\|y - z\|_2^{2}
+ \lambda \|\beta\|_1
\quad
\text{subject to }
z = X\beta
$$

이제 문제의 Lagrangian을 아래와 같이 구할 수 있다.

$$
L(z,\beta, u)= \frac{1}{2} \Vert y-z \Vert^2_2 + \lambda \Vert \beta \Vert_1 + u^{T}(z-X\beta)
$$

**Lagrangian**을 **primal variable** $z, \beta$에 대해 minimize해 **Lagrange dual function**을 구하면 아래와 같다. 3번째 등호는 $\ell_1$ norm의 conjugate로부터 성립된다.

$$
\begin{aligned}
\min_{\beta,\,z}
\;&
\frac{1}{2}\|y - z\|_2^2
+ \lambda \|\beta\|_1
+ u^{T}(z - X\beta)
\\[0.8em]
=\;&
\min_{z}
\left(
\frac{1}{2}\|y - z\|_2^2 + u^{T} z
\right)
+
\min_{\beta}
\left(
\lambda \|\beta\|_1 + (X^{T}u)^{T}\beta
\right)
\\[0.8em]
=\;&
\frac{1}{2}\|y\|_2^2
- \frac{1}{2}\|y - u\|_2^2
+
\min_{\beta}
\lambda
\left(
\|\beta\|_1
- \frac{(X^{T}u)^{T}}{\lambda}\beta
\right)
\\[0.8em]
=\;&
\frac{1}{2}\|y\|_2^2
- \frac{1}{2}\|y - u\|_2^2
-
\lambda I_{v:\|v\|_\infty \le 1}
\left(
\frac{X^{T}u}{\lambda}
\right).
\end{aligned}
$$

따라서 **lasso dual problem**은 아래와 같다. 이때 **Indicator function** 항이 0이어야 maximum 값을 얻을 수 있으므로 제약조건의 형태로 적용된다. ($\Vert X^{T}u \Vert_\infty \le \lambda$)

$$
\max_{u}
\quad
\frac{1}{2}
\left(
\|y\|_2^{2}
-
\|y - u\|_2^{2}
\right)
\quad
\text{subject to }
\|X^{T}u\|_{\infty} \le \lambda
$$

$$
\Longleftrightarrow
\quad 
\min_{u}
\quad
\|y - u\|_2^{2}
\quad
\text{subject to }
\|X^{T}u\|_{\infty} \le \lambda
$$

**Primal problem**의 constraint가 affine function이므로 **Slater's condition**을 만족해 **strong duality**가 성립한다. 따라서 primal과 dual의 optimal value는 동일하다. 하지만 dual 문제를 $\Vert y-u \Vert$ 항만 남기고 쓰면 상수항이 제거되어 **objective function** 값 자체는 primal과 다른 형태를 보인다.<br>

원 문제의 해 $\beta$는 stationary condition ($z-y+u=0$)에 의해 아래와 같이 구할 수 있다.

$$
X\beta = y-u
$$

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/visuallassodual.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Visualization of Lasso Dual Problem.
</div>
<br>

**Dual problem**의 해를 보면 $y$를 set $C=\lbrace u : \Vert X^{T}u \Vert_\infty \le \lambda \rbrace=(X^{T})^{-1}\lbrace v : \Vert v \Vert_\infty \le \lambda \rbrace$로 **projection**한 것과 같다. 이는 위 그림에도 설명되어 있다. $v$의 차원에서 infinity norm cube로 정의된 **hypercube**에 대한 linear map $X$의 **inverse image**는 좌측의 **polyhedron**의 형태로 나타난다.<br>

이게 무슨 의미일까? Primal 문제에서 $\beta$에 대한 **stationary condition**을 보면 아래와 같다.

$$
X^{T}u \in \lambda \partial \Vert \beta \Vert_{1}
$$

경우를 나눠서 생각해보면 

$$
\begin{aligned}
\vert(X^{T}u)_i\vert \le \lambda  \Rightarrow \beta_i = 0 \\
(X^{T}u)_i = +\lambda  \Rightarrow \beta_i \gt 0 \\
(X^{T}u)_i = -\lambda  \Rightarrow \beta_i \lt 0
\end{aligned}
$$

따라서 $X^T u$의 좌표에 따라 **active set**과 **sign pattern**이 결정된다.<br>
**Hypercube**의 각 face는 어떤 $v_i$는 $\pm \lambda$이고 나머지는 $\lt \lambda$이게 되고 내부는 모든 component가 $\lt \lambda$이다.<br>

이를 $(X^T)^{-1}$로 끌고 왔기 때문에 **polyhedron**의 각 face마다 하나의 **lasso active set + sign pattern**이 정해진다.<br> Face에서 활성화되는 **active sets**는 **locally constant**하므로 $y$가 조금 변해도 activate 되는 component들의 set과 부호들은 강건한 것을 알 수 있다.<br> 
이는 **sparse**한 solution을 제공하는 lasso solution의 **nonzero component의 set**이 제공되는 데이터가 크게 변하지 않는 이상 유지된다는 것을 보인다.

---

### Relationship between conjugate and dual problems

**Conjugates**는 **dual problem formulation** 중 **Lagrangian 최소화** 과정에서 다음과 같은 형태로 자주 등장하곤 한다.

$$
-f^{\ast}(u) = \min_{x} \; f(x) - u^{T}x
$$

예를 들어 아래와 같은 문제를 생각해보자.

$$
\min_{x} \; f(x) + g(x)
$$

위 문제는 **auxiliary variable** $z$를 사용해 아래와 같이 표현할 수 있다.

$$
\min_{x, z} \; f(x) + g(z) \quad \text{subject to }x=z
$$

$$
g(u) = \min_{x} \; f(x)+ g(z) + u^{T}(z-x) = -f^{\ast}(u)-g^{\ast}(-u)
$$

따라서 dual problem은

$$
\max_{u} \; -f^{\ast}(u)-g^{\ast}(-u)
$$

**Examples**
<br>

- **Indicator function:** ($I_{C}^{\ast}$는 $C$의 support function)

$$
\begin{aligned}
\text{Primal:} \quad & \min_{x} \; f(x) + I_{C}(x) \\
\text{Dual:} \quad & \max_{u} \; - f^{\ast}(u) - I_{C}^{\ast}(-u)
\end{aligned}
$$

- **Norms:** 

$$
\begin{aligned}
\text{Primal:} \quad & \min_{x} \; f(x) + \|x\| \\
\text{Dual:} \quad & \max_{u} \; -f^{\ast}(u)
\quad \text{subject to } \|u\|_{\ast} \le 1
\end{aligned}
$$

---

### Shifting linear transformation

Example of Lasso problem에서 우리는 **linear transformation**을 objective의 한 항에서 **dual formulation** 결과의 다른 항으로 **shifting** 시키는 trick을 사용했었다.<br>
다음과 같은 문제가 있다고 하자.

$$
\min_{x} \; f(x) + g(Ax)
$$

이 문제는 다음 형태로 바꿀 수 있다.

$$
\min_{x,\,z} \; f(x) + g(z)
\quad \text{subject to} \quad
A x = z
$$

이 형태로 dual problem을 구하면 다음과 같다.

$$
\max_{u} \; -f^{\ast}(A^{T}u) - g^{\ast}(-u)
$$

이는 가끔 유용할 때가 있다. 만약 $f$가 differentiable하고 $g$가 그렇지 않다면 primal problem은 **projected gradient descent, proximal gradient descent, subgradient method** 등의 방법들로 풀어야 하는데 이러한 method들은 문제 형태에 따라 적용하기 어려울 수 있다.<br>
하지만 primal 문제를 **dual**로 바꾸면 $f^{\ast}$의 **differentiable**을 유지하고 $g^{\ast}$는 **projection**이나 **proximal operator**를 nondifferentiable 중 적용하기 쉬운 형태로 바꿔 앞서 언급한 **1st order method** 적용에 용이하게 만들 수 있다.

---

## Dual cones

Cone $K \subseteq \mathbb{R}^n$에 대한 **dual cone**의 정의는 아래와 같다.

$$
K^{\ast} = \lbrace y:y^{T}x \ge 0 \quad \forall x \in K \rbrace
$$

Dual cone은 항상 **convex cone**이며 아래와 같은 특징을 가진다.

$$
y\in K^{\ast} \Longleftrightarrow \text{the halfspace} \; \lbrace x:y^{T}x\ge 0 \rbrace \; \text{contains} \; K
$$

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/dualconepic.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    The halfspace contains K<br>
    (from B&V page 52)
</div>
<br>

만약 $K$가 closed convex cone이라면 $K^{\ast\ast}=K$이다.

---

**Exmples**<br>

- **Linear subspace:** linear subspace $V$의 dual cone은 $V^{\perp}$ 즉, orthogonal complement이다. e.g., $(\text{row}(A))^{\ast}=\text{null}(A)$
<br>

- **Norm cone:** norm cone의 dual cone은 dual norm으로 정의되는 norm cone이다.

$$
K^{\ast} = \lbrace (y,s) \in \mathbb{R}^{n+1}:\Vert y \Vert_{\ast} \le s \rbrace
$$

- **Positive semidefinite cone:** convex cone $\mathbb{S}^n_{+}$는 self-dual cone이다. 아래 식을 eigenvalue decomposition해 생각해보면 쉽게 알 수 있다.

$$
Y \succeq 0 \Longleftrightarrow \text{tr}(YX) \ge 0, \quad \forall X\succeq 0
$$

---

### Dual cones and dual problems

다음과 같은 **cone constrained problem**을 가정하자.

$$
\min_{x} \; f(x)
\quad \text{subject to} \quad
A x \in K
$$

Dual problem은 다음과 같다. $K$의 **support function**이 전개 중 나오게 된다.


$$
I^{\ast}_{K}(y)=\max_{z\in K} z^T y
$$

$$
\max_{u} \; -f^{\ast}(A^{T}u) - I_{K}^{\ast}(-u)
$$

$K$가 cone이라면 식은 다음과 같이 단순하게 정리된다.

$$
\max_{u} \; -f^{\ast}(A^{T}u)
\quad \text{subject to} \quad
u \in K^{\ast}
$$

위 변환은 다음 관계 때문에 성립한다.

$$
I^{\ast}_K (-u) = I_{K^\ast}(u)
$$ 

$u$가 **dual cone**에 존재하면 $-z^T u\le 0$이라 0이 최댓값, dual cone 외부에 존재하면 $-z^T u \gt 0$라 $\infty$가 최댓값이 되기 때문이다.<br>

수많은 문제들이 **cone constraints** 형태로 표현될 수 있으므로 이는 매우 유용한 결론이다.

---

## Dual subtleties

- **Dual problem**을 **equivalent problem**으로 바꿔도 dual이라고 부를 수 있다. Strong duality 하에서 우리는 변형된 dual problem의 해를 primal solution을 찾기 위해 사용할 수 있다.<br>
    하지만 변형된 dual 문제의 최적값이 반드시 primal의 최적값인 것은 아니다.

- 제약 조건이 없는 문제에 대해 dual 문제를 유도하는 일반적인 방법은 보조 변수와 **equality** 제약 조건을 추가해 **primal problem**을 변형하는 것이다.<br>
    구체적으로 어떻게 할지는 모호함이 있다. 다양한 선택에 따라 다른 **dual problem**들이 나올 수 있다.

---

## Double dual

다음과 같은 일반적인 **linear constraints**를 갖는 최적화 문제를 가정하자.

$$
\begin{aligned}
\min_{x}\quad & f(x) \\
\text{subject to}\quad & Ax \le b,\; Cx = d
\end{aligned}
$$

**Lagrangian**은

$$
L(x,u,v)=f(x)+(A^{T}u + C^{T}v)^{T}x - b^{T}u - d^{T}v
$$

따라서 **dual problem**은

$$
\begin{aligned}
\max_{u,v}\quad & - f^{\ast}\!\left(-A^{T}u - C^{T}v\right) - b^{T}u - d^{T}v \\
\text{subject to}\quad & u \ge 0
\end{aligned}
$$

해당 Dual problem을 새로운 **primal problem**으로 보고 dual problem으로 한 번 더 변형시키면 해당 문제는 primal이 된다.<br>

이러한 관계는 linear constraints보다 훨씬 깊게 적용된다.<br>
다음과 같은 일반적인 **convex problem**을 생각하자.

$$
\begin{aligned}
\min_{x}\quad & f(x) \\
\text{subject to}\quad 
& h_i(x) \le 0,\; i = 1,\ldots,m \\
& \ell_j(x) = 0,\; j = 1,\ldots,r
\end{aligned}
$$

$f$, $h_i$가 전부 **closed and convex**이고 $\ell_j$가 전부 **affine**이라면 dual 문제의 dual은 primal 문제가 된다.<br>

해당 내용의 증명은 bifunction을 최소화하는 문제로 관점을 달리해야 한다. 그러면 dual function은 bifunction의 conjugate에 대응하게 된다. (자세한 내용은 Rockafellar의 CH 29와 30을 참고)<br>

- **Double dual**의 구체적인 증명은 Perturbation-Duality Scheme in Optimization 관련 포스트에서 설명하겠습니다.