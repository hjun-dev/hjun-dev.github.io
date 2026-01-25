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

Root-finding update $\Delta y = (\Delta x, \Delta u, \Delta v)$는 다음과 같다.

$$
\begin{aligned}
\begin{bmatrix}
H_{\mathrm{pd}}(x) & Dh(x)^{T} & A^{T} \\
-\operatorname{diag}(u)\,Dh(x) & -\operatorname{diag}(h(x)) & 0 \\
A & 0 & 0
\end{bmatrix}
\begin{bmatrix}
\Delta x \\
\Delta u \\
\Delta v
\end{bmatrix}
=
-
\begin{bmatrix}
r_{\mathrm{dual}} \\
r_{\mathrm{cent}} \\
r_{\mathrm{prim}}
\end{bmatrix}
\end{aligned}
$$

여기서 $H_\mathrm{pd}(x) = \nabla^2 f(x) + \sum^m_{i=1}u_i\nabla^2 h_i(x)$이다.

정리하자면 

- v2에서는 primal variable과 dual variable의 update direction이 하나의 KKT system을 통해 동시에 결정된다.

- v1과 v2는 서로 다른 업데이트를 유도한다.

- v1의 한 번의 iteration은 barrier method의 centering step에서 수행되는 inner iteration과 같다.

- v2는 primal-dual interior-point method라는 새로운 방법을 정의하며 이후에 더 자세히 볼 것이다.

- 한 가지 중요한 점은 v2에서의 dual iterates가 origianl dual problem에 대해 반드시 dual feasible하지 않는다는 것이다.<br>(v1에서는 outer iteration마다 거의 central path에 있어 dual feasibility가 만족된다.)

---

## Surrogate duality gap

Barrier method에서 duality gap은 $m/t$로 주어지며 central path 위에서는 $u_i$가 원 문제에 대해 dual feasible이다.<br>

Primal-dual interior-point method에서는 중간 iterate가 반드시 primal 또는 dual feasible하지 않으므로 진짜 duality gap 대신 다음과 같은 surrogate duality gap을 정의한다.

$$
\eta = -h(x)^{T}u
= -\sum_{i=1}^{m} u_i h_i(x)
$$

$r_\mathrm{prim}=0$, $r_\mathrm{dual}=0$이 보장되지 않으면 이 값은 원 문제의 실제 duality gap과 일치하지 않는다. 하지만 perturbed KKT conditions를 정확히 만족하는 경우에는 다음 식이 성립한다.

$$
u_i h_i (x) = -\frac{1}{t} \quad \Rightarrow \quad \eta=\frac{m}{t}
$$

따라서 $\eta$는 현재 iterate가 central path에서 어떤 barrier parameter $t$에 대응되는 지를 나타내는 척도로 해석할 수 있다.<br>

기존 barrier method에서는 $t^{(0)}$를 정한 뒤 $\mu$를 곱해가며 outer loop를 진행한다. 반면에 primal-dual interior-point method에서는 outer loop 없이 매 step마다 $(x,u,v)$를 동시에 업데이트하므로 $t$를 외부에서 매번 증가시키는 방식은 오히려 수렴을 방해할 수 있다. 대신 현재 state에서 계산된 $\eta$를 통해 암묵적으로 대응되는 $t \approx m/\eta$의 scale을 추적함으로써 centrality 수준을 상태에 맞게 adaptive하게 조절한다.<br>

또한 $\eta$는 현재 iterate가 최적점으로부터 얼마나 떨어져 있는지를 나타내는 수렴 지표로도 사용된다. 해가 수렴하여 complementary slackness에 가까워질수록 $\eta \rightarrow 0$이며 이에 따라 대응되는 $t$는 자동으로 매우 큰 값이 된다.

---

## Primal-dual interior-point method

구체적인 primal-dual interior-point method에 대해 알아보자.<br>
$h_i(x^{(0)})\lt 0,i=1,\ldots,m$을 만족하는 $x^{(0)}$와 $u^{(0)}\gt 0$, $v^{(0)}$에서 시작한다. (이는 primal & dual feasible point가 된다.) $\eta^{(0)}=-h(x^{(0)})^{T}u^{(0)}$로, $\mu \gt 1$는 특정 값으로 설정한다.<br>
아래를 $k=1,2,3,\ldots$에 대해 반복한다.

- Define $t=\mu m / \eta^{(k-1)}$

- Compute primal-dual update direction $\Delta y$

- Use backtracking to determine step size $s$

- Update $y^{(k)}=y^{(k-1)}+s\cdot \Delta y$

- Compute $\eta^{(k)} = -h(x^{(k)})^{T}u^{(k)}$

- Stop if $\eta^{(k)}\le \epsilon$ and $(\Vert r_\mathrm{prim}\Vert^2_2 + \Vert r_\mathrm{dual} \Vert^2_2)^{1/2} \le \epsilon$

Backtracking line search 과정에서 $h_i(x) \lt 0, u_i \gt 0, i=1,\ldots,m$을 유지하도록 보장하며 stopping criterion은 surrogate duality gap과 approximate feasibility를 모두 사용한다.

---

## Backtracking line search

매 step마다 $y^+ = y+s\Delta y$ 즉,

$$
x^{+}=x+s\Delta x,\quad
u^{+}=u+s\Delta u,\quad
v^{+}=v+s\Delta v
$$

는 $h_i(x) \lt 0, u_i \gt 0, i=1,\ldots,m$를 유지해야 한다. <br>
이러한 inequality constraints는 Newton step이 직접적으로 처리할 수 있는 equality constraints가 아니다. 따라서 본 알고리즘에서는 equality constraints에 대해 계산된 Newton direction을 따라가되 backtracking line search를 통해 step size $s$를 조절함으로써 iterates가 항상 feasible set의 내부에 머물도록 한다.<br>

**Multi-stage backtracking line search** 과정은 다음과 같다:<br>

먼저 $u+s\Delta u \ge 0$을 만족하는 최대 step size $s_\mathrm{max}\le 1$을 고른다:

$$
s_{\max}=\min\left\{1,\;\min\left\{-\frac{u_i}{\Delta u_i}:\Delta u_i<0\right\}\right\}
$$

$s_\mathrm{max}$가 $u\gt 0$를 만족하기 위해서 $s=0.999s_\mathrm{max}$를 한다.<br>
파라미터 $\alpha, \beta \in (0,1)$를 설정해 아래 과정을 진행한다.

- $h_i(x^+)\lt 0$를 만족할 때까지 $s=\beta s$

- $\Vert r(x^+, u^+, v^+)\Vert_2 \le (1-\alpha s) \Vert r(x,u,v)\Vert_2$를 만족할 때까지 $s=\beta s$

마지막 조건은 다음과 같이 유도된다.<br>
먼저 Newton step은

$$
\Delta y = -r^\prime(y)^{-1}r(y) \quad \Leftrightarrow\quad r(y) = -r^\prime(y)\Delta y
$$

Newton step은 선형화의 결과이므로 Armijo 조건을 위해 Taylor 1차 근사식을 살펴보면

$$
r(y+s\Delta y) \approx r(y) + r^\prime (y)(s\Delta y) = (1-s)r(y)
$$

따라서 적절한 $\alpha$에 대해 $\Vert r(x^+, u^+, v^+)\Vert_2 \le (1-\alpha s) \Vert r(x,u,v)\Vert_2$ 조건이 나오게 된다.

---

## Some history

- **Dantzig (1940년대):** Simplex method는 선형계획법(LP)을 위한 알고리즘 중 오늘날까지도 가장 잘 알려지고 많이 연구된 방법 중 하나이다.

- **Klee와 Minty (1972):** 변수 $n$개와 제약식 $2n$개를 갖는 병리적인(pathological) LP 예제에서 심플렉스 방법은 해를 구하는 데 $2^n$번의 반복이 필요하다.

- **Khachiyan (1979):** Nemirovski와 Yudin (1976)의 ellipsoid method에 기반한 LP를 위한 다항시간(polynomial-time) 알고리즘. 이론적으로는 강력하지만 실제 계산에서는 성능이 약하다.

- **Karmarkar (1984):** LP를 위한 내부점(interior-point) 기반의 다항시간 알고리즘. 비교적 효율적임 (미국 특허 4,744,026, 2006년에 만료).

- **Renegar (1988):** LP를 위한 뉴턴 기반 내부점 알고리즘. Lee와 Sidford (2014) 이전까지 알려진 최고의 복잡도를 가짐.

- 현대의 최첨단 LP 솔버들은 일반적으로 심플렉스 방법과 내부점 방법을 모두 사용한다.

---

## Highlight: standard LP

