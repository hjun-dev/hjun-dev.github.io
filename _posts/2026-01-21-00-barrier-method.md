---
layout: post
title: "[Convex Optimization] 15. Barrier Method"
description: "Inequality and equality constrained problem을 풀기 위한 second-order method 중 하나인 Barrier Method 정의 및 분석"
date: 2026-01-15 11:00:00 +0900
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

이 포스트에서는 Second-order method 중 하나인 **Barrier Method**를 알아볼 것이다.<br>
가장 대표적인 두 **interior points methods**에는 **barrier method**와 **primal-dual interior poinr method**가 있으며 전자는 이번 포스트에서, 후자는 다음 포스트에서 다룬다.

---

## Hierarchy of Second-Order Methods

지금까지 살펴본 문제와 method들을 계층적으로 정리해보자. 여기서 고려하는 모든 problem은 convex problem으로 가정한다.<br>

- **Quadratic Problems:** Unconstrained convex quadratic problem이며 가장 풀기 쉽다. Hessian이 들어간 linear system을 푸는 것으로 closed-form solution을 구할 수 있다.

- **Equality-constrained Quadratic Problems:** 이전 포스트에서 다룬 것처럼 **KKT conditions**을 이용해 closed-form solution을 구할 수 있다. 마찬가지로 풀기 쉽다.

- **Equality-constrained Smooth Problems:** 이전의 카테고리와 유사하지만 quadratic problem이 아닌 일반적인 twice differentiable problem에 대한 문제이다. 하지만 이전처럼 equality-constrained quadratic problems를 푸는 Newton's method를 연속적으로 사용해 해를 구할 수 있다.

- **Inequality-constrained and Equality-constrained Smooth Problems:** 지금까지 공부한 방법으로는 projected gradient descent (PGD)만 이 문제를 풀 수 있다. 그러나 PGD는 projection이 어려울 수 있으며 Newton's method의 더 빠른 수렴성을 잃을 수 있다. 따라서 equality constraints만 존재하게 만드는 interior-point methods를 사용해 이전과 같은 방식으로 문제를 풀 수 있게 한다.

## Log Barrier Function

다음과 같은 convex optimization problem을 보자.

$$
\begin{aligned}
\min_{x}\quad & f(x) \\
\text{subject to}\quad & h_i(x) \le 0,\quad i = 1,\ldots,m \\
& Ax = b
\end{aligned}
$$

$f, h_1, h_2, \dots, h_m$는 convex, twice differentiable이며 각 domain은 간단히 $\mathbb{R}^n$라 하자.<br>

위 문제의 Log-barrier function은 다음과 같다.

$$
\phi(x) = - \sum_{i=1}^{m} \log\bigl(-h_i(x)\bigr)
$$

Log-barrier function의 domain은 strictly feasible points들의 집합이 된다. $\lbrace x: h_i(x)\lt 0 , i=1, \dots,m \rbrace$<br>
이 집합이 nonempty라면 자동으로 strong duality도 성립하게 된다.
<br>

이제 원 문제의 inequality constraints를 objective function에 넣어 없애면 다음과 같다.

$$
\min_{x}\; f(x) + \sum_{i=1}^{m} I_{h_i(x)\le 0}(x)
$$

하지만 해당 문제는 여전히 $h_i$의  boundary에서 non-smooth이며 풀기 어렵다. 따라서 main idea는 이 indicator function을 log-barrier를 통해 근사해 문제를 푸는 것이다.

$$
\min_{x}\; f(x) + \frac{1}{t}\,\phi(x)
$$

위 식에서 $t$는 $t\gt0$인 큰 수를 고른다. 아래의 그림에서 $t$가 커질수록 indicator function의 형태와 유사해지는 것을 확인할 수 있다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/logbarrierindicator.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Log-barrier function as an approximation.
</div>
<br>

---

## Convexity of Log Barrier Function

Log-barrier function이 convex function인 것을 convexity를 유지하는 composition을 통해 확인할 수 있다.<br>
Inner function $h_i(x)$가 convex이고 outer function $-\log(-x)$가 convex & non-decreasing이므로 $-\log(-h_i(x))$는 convex function이다. 또한 convex function들의 summation 역시 convex function이므로 convexity가 입증된다.

---

## Log barrier calculus

다음의 log-barrier function에 대해

$$
\phi(x) = - \sum_{i=1}^{m} \log\bigl(-h_i(x)\bigr)
$$

Gradient는

$$
\nabla \phi(x)
= - \sum_{i=1}^{m} \frac{1}{h_i(x)} \, \nabla h_i(x)
$$

Hessian은

$$
\nabla^{2} \phi(x)
= \sum_{i=1}^{m} \frac{1}{h_i(x)^2} \, \nabla h_i(x)\nabla h_i(x)^{T}
\;-\;
\sum_{i=1}^{m} \frac{1}{h_i(x)} \, \nabla^{2} h_i(x)
$$

---

## Central Path

**Log-barrier approximation**을 통해 원 문제를 아래와 같이 변형시킬 수 있다.

$$
\begin{aligned}
\min_{x}\quad & t f(x) + \phi(x) \\
\text{subject to}\quad & Ax = b
\end{aligned}
$$

**Central path**는 위 문제의 $t \gt 0$에 대한 solution $x^{\ast}(t)$를 의미한다.<br>

- 우리는 $t \rightarrow \infty$라면 $x^{\star}(t)\rightarrow x^{\star}$일 것을 기대한다.

- 그럼 $t$를 처음부터 매우 큰 수로 설정하면 바로 **central path**의 끝에 있는 해를 찾게되지 않을까?라고 생각할 수 있다.

- 하지만 실제로 이 방식은 매우 비효율적이며 대신 central path를 **traverse**하는 것이 훨씬 효율적이다. 추후에 더 자세히 볼 것이다.

---

## Special Case: Linear Program

**Linear Program**에 대한 **barrier problem**을 보자. $Dx\le e$의 **polyhedral constraint**에 대한 barrier function이다.

$$
\min_{x}\;\; tc^{T}x \;-\; \sum_{i=1}^{m} \log\!\bigl(e_i - d_i^{T}x\bigr)
$$

**Gradient optimality condition**은 아래와 같다.

$$
0=t c+\sum_{i=1}^{m}\frac{1}{e_i-d_i^{T}x^{\star}(t)}\,d_i
$$

이는 $\nabla \phi(x^{\star}(t))$가 $c$와 평행해야 함을 의미한다. 따라서 다음 그림에서처럼 **hyperplane** $\lbrace x: c^{T}x = c^Tx^{\star}(t) \rbrace$이 $x^{\star}(t)$에서 $\phi$의 **contour**에 접하게 나타나는 것을 알 수 있다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/barrierlpproblem.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Central path inside the polyhedron.<br>
    (from B&V page 565)
</div>
<br>

위 그림처럼 각 $t$에 대해 내부에서 최적점을 찾아 경계로 이동하는 central path를 보인다. 이 때문에 interior point method라고 불린다.

---

## KKT Conditions and Duality

Central path의 KKT conditions는 아래와 같다. (for some $w \in \mathbb{R}^m$)

$$
\begin{aligned}
& t\nabla f(x^\star(t))
-\sum_{i=1}^{m}\frac{1}{h_i(x^\star(t))}\nabla h_i(x^\star(t))
+ A^T w = 0,\\
& Ax^\star(t) = b,\quad
h_i(x^\star(t))<0,\ i=1,\ldots,m
\end{aligned}
$$

원 문제의 KKT condition은 아래 문제와 같으며 complementary slackness의 boundary condition을 알기 매우 어렵다.

$$
\begin{aligned}
& \nabla f(x^\star)
+ \sum_{i=1}^{m} u_i^\star \nabla h_i(x^\star)
+ A^T v^\star = 0 \\
& Ax^\star = b,\quad
h_i(x^\star) \le 0,\quad
u_i^\star \ge 0, \\
& h_i(x^\star)\cdot u_i^\star = 0,\quad
i = 1,\ldots,m
\end{aligned}
$$

따라서 원 문제의 KKT condition의 $u^{\star}_i(t), v^{\star}_i(t)$는 아래와 같이 대응된다.

$$
\begin{aligned}
& u_i^\star(t)=-\frac{1}{t\,h_i(x^\star(t))},\quad i=1,\ldots,m \\
& v^\star(t)=w/t
\end{aligned}
$$

따라서 Central path의 KKT condition을 다시쓰면 아래와 같다.

$$
\begin{aligned}
& \nabla f(x^\star(t))
+ \sum_{i=1}^{m}u_i(t)\nabla h_i(x^\star(t))
+ A^Tv
= 0,\\
& Ax^\star(t)=b,\quad
u_i(t)\cdot h_i(x^\star(t))=-\frac{1}{t},\quad
h_i(x^\star(t))<0,\quad
u_i(t)>0,\ i=1,\ldots,m
\end{aligned}
$$

이는 central path가 complementary slackness 조건 $h_i(x^{\star})u_i^{\star}=0$을 다음과 같이 완화한 형태임을 보여준다. $t \rightarrow \infty$이면 slackness 조건과 동일해진다.

$$
h_i(x^{\star}(t))u^{\star}_i(t) = -\frac{1}{t}
$$

---

**Dual Feasibility 검증**

위와 같이 central path의 dual 변수 $u^{\star}(t), v^{\star}(t)$를 정의하기 위해서는 이들이 원 문제의 dual feasible point임을 확인해야 한다.<br>
Dual feasibility는 다음 두 조건으로 정의된다.<br>
1. Inequality constraints에 대한 dual variable은 $u\ge 0$이어야 한다.

2. Lagrange dual function $g(u,v)=\min_xL(x,u,v)$가 $-\infty$가 아니어야 한다.

먼저 $h_i(x^{\star}(t))\lt 0$이므로 다음이 성립해 첫 조건을 만족한다.

$$
u_i^{\star}(t) = - \frac{1}{t\;h_i(x^{\star}(t))} \gt 0
$$

다음으로 central path의 KKT conditions에 $u^{\star}(t),v^{\star}(t)$를 대입하면 다음과 같다.

$$
\nabla f(x^\star(t))
+\sum_{i=1}^{m}u_i^\star(t)\nabla h_i(x^\star(t))
+A^T v^\star(t)
=0
$$

이는 $x^{\star}(t)$가 Lagrangian $L(x, u^{\star}(t), v^{\star}(t))$의 stationary point임을 의미한다.<br>
원 문제가 convex problem이었으므로 Lagrangian역시 $x$에 대해 convex function이다. 따라서 위 stationary 조건으로 $x^{\star}(t)$는 전역 최소해가 되며 결과적으로 다음과 같다.

$$
g(u^\star(t),v^\star(t))
=\inf_x L(x,u^\star(t),v^\star(t))
= L(x^\star(t),u^\star(t),v^\star(t))
> -\infty
$$

결론적으로 $(u^{\star}(t), v^{\star}(t))$는 원 문제의 dual feasible point이다.

---

## Duality Gap

Barrier problem의 equality-constraints는 hard constraints라 $x^{\ast}(t)$는 반드시 해당 constraints를 0으로 만든다. 따라서 다음과 같이 전개된다.

$$
\begin{aligned}
g(u^\star(t),v^\star(t))
&= f(x^\star(t)) + \sum_{i=1}^{m} u_i^\star(t)\,h_i(x^\star(t))
   + v^\star(t)^T\bigl(Ax^\star(t)-b\bigr) \\
&= f(x^\star(t)) - \frac{m}{t}
\end{aligned}
$$

$g(u^{\star}(t),v^{\star(t)})\le \max_{u,v}g(u(t),v(t))\le f^{\star}$이므로 다음과 같다.

$$
f(x^{\star}(t))-f^{\star}\le \frac{m}{t}
$$

$m/t$는 stopping criterion으로 쓸 수 있으며 $t\rightarrow \infty$라면 $x^{\star}(t) \rightarrow x^{\star}$임을 알 수 있다.

---

## Perturbed KKT Conditions

이제 central path $(x^{\star}(t), u^{\star}(t), v^{\star}(t))$를 아래와 같은 perturbed KKT conditions를 만족하는 solution으로 볼 수 있다.

$$
\begin{aligned}
&\nabla f(x)+\sum_{i=1}^{m}u_i\nabla h_i(x)+A^Tv=0 \\[6pt]
&u_i\cdot h_i(x)=\frac{1}{t},\quad i=1,\ldots,m \qquad (\text{perturbation}) \\[6pt]
&h_i(x)\lt 0,\quad i=1,\ldots,m,\qquad Ax=b \\[6pt]
&u_i\ge 0,\quad i=1,\ldots,m
\end{aligned}
$$

Actual KKT conditions와는 complementary slackness와 primal feasibility의 inequaility constraints만 다른 것을 볼 수 있다. $t\rightarrow\infty$면 actual KKT conditions와 거의 같아진다.

---

## Barrier Method Algorithm and Considerations

Barrier method는 연속적으로 $t \gt 0$을 증가시키며 아래 문제를 $m/t\lt \epsilon$를 만족할때까지 푸는 것이다.

$$
\begin{aligned}
&\min_x\quad \quad  \;\;\;\;tf(x)+\phi(x)\\
&\text{subject to}\; \;\;Ax=b
\end{aligned}
$$

Barrier method의 구체적인 알고리즘은 다음과 같다.

1. Initialize $t^{(0)}\gt 0, \mu \gt 0$. Solve the minimization problem to get $x^{(0)}=x^{\star}(t^{(0)})$

2. For $k=1,2,3,\ldots$ <br>
    
    $(a)$ Compute $t^{(k)}=\mu t^{(k-1)}$<br> 
    $(b)$ Solve minimization problem using Newton's method initialized at $x^{(k-1)}$ to get $x^{(k)}=x^{\ast}(t^{(k)})$<br>
    $(c)$ if $m/t \le \epsilon$ break

$(b)$ 단계를 centering step이라고 부른다.<br>

알고리즘을 설정할 때 $\mu$와 $t^{(0)}$를 선택할 때 아래를 고려해야 한다.

- **Choice of $\mu$:** 만약 $\mu$가 너무 작으면 outer iteration이 너무 많이 필요하고 $\mu$가 너무 크면 각 centering step에서 Newton's method가 수렴에 너무 오래 걸릴 수 있다.

- **Choice of $t^{(0)}$:** 만약 $t^{(0)}$가 너무 작으면 outer iteration을 많이 진행해야 하고 $t^{(0)}$가 너무 크면 처음 centering step이 너무 오래 걸릴 수 있다.


하지만 다행히도 barrier method의 performance는 두 선택에 꽤나 robust하다고 한다.<br>

아래 예시 그래프는 $n=50$ 차원, $m=100$ inequality constraints의 small LP를 barrier method로 푼 결과이다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/convergencefordiffval.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Convergence for different values of $\mu$<br>
    (from B&V page 571)
</div>
<br>

---

## Convergence analysis

Centering steps를 정확히 풀면서 barrier method를 진행했다고 가정하자. 다음의 수렴속도 식이 바로 나온다.<br>

**Theorem**: The barrier method after $k$ centering steps satisfies

$$
f(x^{(k)})-f^{\star} \le \frac{m}{\mu^k t^{(0)}}
$$

이는 우리가 $\epsilon$의 정확도를 가지고 싶다면 아래의 centering steps가 필요하다는 것과 같다. (initial centering step 비포함)

$$
\frac{m}{\mu^k t^{(0)}} \le \epsilon
$$

$$
\mu^k \ge \frac{m}{\epsilon t^{(0)}}
$$

$$
k\log\mu \ge \log\frac{m}{\epsilon t^{(0)}}
$$

$$
k \ge \frac{\log(m/(t^{(0)}\epsilon))}{\log\mu}
$$

결과를 보면 제약 조건의 개수 $m$에 대해 로그 스케일로 증가하며 $m$이 고정된 경우에는 linear convergence를 보인다.<br>
아래의 LP 예제에서도 로그스케일에 대한 linear convergence임을 확인할 수 있다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/linearconvergencebarriermethod.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Convergence scales only with log of constraints, very slow scaling, good behavior<br>
    (from B&V page 575)
</div>
<br>

각 centering step에서 Newton iteration은 얼마나 필요할까? Self-concordant 함수의 경우 $x$의 작은 변화는 Newton method가 quadratic convergence phase로 작동하게 한다. 따라서 매 iteration마다 큰 반복을 필요로 하지 않게 되며 반복 횟수가 대략 상수 개수로 유지된다.
결과적으로 전체 반복 step의 수도 아래 식과 같이 나타난다.

$$
\mathcal{O}(\log(m/\epsilon t^{(0)}))
$$

목적함수인 $tf+\phi$는 $f, h_i$가 전부 linear or quadratic이라면 self-concordant를 만족한다. 따라서  이는 LPs, QPs, QCQPs에 해당하며 이 문제들은 barrier method로 쉽게 풀린다.

---

## Feasibility Criterion

$t$를 키워가며 전 centering step의 결과로 얻은 strictly feasible point로 초기화해 다음 centering step을 진행했다.<br>
그럼 첫 번째 centering step에서 $x^{(0)}$는 어떻게 구할까?<br>

다음과 같은 LP를 풀면 strictly feasible point를 구할 수 있다.

$$
\begin{aligned}
&\min_{x,s}\quad s\\
&\text{s.t.}\quad h_i(x)\le s,\quad i=1,2,\ldots,m\\
&\qquad\;\; Ax=b
\end{aligned}
$$

위 문제의 optimal solution을 구할 필요 없이 $s\lt 0$이면 종료하고 해당 $x$를 feasible point $x^{(0)}$로 설정한다. 이러한 방법을 feasibility method라고 부른다.<br>

하지만 위 방법만으로는 infeasible한 경우에 어떤 constraint때문에 infeasible한지 알 수 없다. 따라서 다음과 같은 LP를 풀어 각 constraints에 upper bound를 걸어 어떤 constraints가 infeasible하게 만드는지 분석할 수 있다.

$$
\begin{aligned}
&\min_{x,s}\quad \mathbf{1}^T s\\
&\text{s.t.}\quad h_i(x)\le s_i,\quad i=1,2,\ldots,m\\
&\qquad\;\; Ax=b,\; s\ge 0
\end{aligned}
$$

모든 $s$가 0이라면 feasible point가 존재함을, $s\gt0$가 나타난다면 해당 constraint 때문에 원 문제가 infeasible함을 알 수 있다.