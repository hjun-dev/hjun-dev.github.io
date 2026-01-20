---
layout: post
title: "[Convex Optimization] 14. Newton's Method"
description: "Second-order method의 대표적인 알고리즘인 Newton's Method 정의 및 분석"
date: 2026-01-15 11:00:00 +0900
tags: [math, study]
categories: [optimization]
related_posts: True
pretty_table: true
toc:
  sidebar: left
---

## Introduction
<br>

이 포스트에서는 Second-order method 중 대표적인 알고리즘인 **Newton's Method**에 대해 살펴본다.<br>
구체적인 topic들은 아래와 같다.
- **Interpretations and properties**
<br>

- **Backtracking line search**
<br>

- **Convergence analysis**
<br>

- **Equality-constrained Newton**
<br>

- **Quasi-Newton preview**

---

## Newton's Method

먼저 **second-order method** 중 하나인 **Newton's Method**에 대해 정의하고 **first-order method**인 **gradient descent**와 비교해 볼 것이다.
<br>

Unconstrained, smooth convex optimization 문제를 하나 가정해보자.

$$
\min_{x} \; f(x)
$$

$f$는 convex, twice differentiable, $\text{dom}(f)=\mathbb{R}^n$이다.<br>

먼저 gradient descent의 경우 해당 문제에 대해 $x^{(0)} \in \mathbb{R}^n$부터 아래의 과정을 반복한다.

$$
x^{(k)} = x^{(k-1)} - t_k \cdot \nabla f(x^{(k-1)})
$$

이에 반해 Newton's Method는 아래의 과정을 반복한다.

$$
x^{(k)} = x^{(k-1)} - (\nabla^2 f(x^{(k-1)}))^{-1} \nabla f(x^{(k-1)})
$$

이때 $\nabla^2 f(x^{(k-1)})$는 $x^{(k-1)}$에서 $f$에 대한 **Hessian matrix**를 의미한다.

---

### Newtons' method interpretation

Gradient descent의 의미는 다음과 같은 **quadratic approximation**을 $y$에 대해 최소화하는 지점으로 업데이트 하는 것이다.

$$
f(y) \approx f(x) + \nabla f(x)^{T}(y-x) + \frac{1}{2t} \Vert y-z \Vert^2_2
$$

위 근사 식을 $y$에 대해 최소화하는 $x^+ = x - t \nabla f(x)$이며 이는 gradient descent 업데이트 식과 동일하다. <br>
여기서 $\nabla f(x)^{T}(y-x)$의 **first order term**은 gradient 정보를 사용하지만 $\frac{1}{2t}\Vert y-x \Vert^2_2$의 **second order term**은 Hessian 정보를 $\text{diag}(\frac{1}{t})$로 근사한 것을 알 수 있다.
<br>

이와 달리 Newton's Method는 quadratic approximation에 Hessian 정보를 그대로 사용한다.

$$
f(y) \approx f(x) + \nabla f(x) ^{T}(y-x) + \frac{1}{2}(y-x)^{T} \nabla^2f(x)(y-x)
$$

마찬가지로 위 식을 $y$에 대해 최소화하는 점을 구해 업데이트하면 $x^+ = x - (\nabla^2 f(x))^{-1}\nabla f(x)$가 된다. 이는 **Newtons's method**의 업데이트 식과 동일한 것을 알 수 있다.

---

### Example Newton's method vs gradient descent

Newton's method와 gradient descent를 실제 예제를 통해 비교해보자.<br>
다음의 함수를 최소화하는 문제를 가정하자.

$$
f(x) = (10x_1^2 + x^2_2) / 2 + 5\log(1+e^{-x_1-x_2})
$$

이 문제는 **nonquadratic function**이기 때문에 수렴에 여러 스텝이 걸린다. (Quadratic function이라면 한 스텝에 수렴.)

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/gdvsnmgraph.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Comparison gradient descent (black curve) to Newton's mehtod (blue curve).
</div>
<br>

위 그림에서는 Gradient descent와 Newton's method의 적절한 비교를 위해 거의 비슷한 step size를 적용했다.
<br>
Gradient descent는 gradient의 방향을 그대로 따르고 곡률을 step size로 예측해 이동 정도를 결정한다. 따라서 위 그림에서 GD는 등고선에 수직으로 이동하는 것을 볼 수 있다. 하지만 Newton's method는 곡률 정보를 그대로 가져와 사용하므로 등고선의 형태와는 무관하게 비교적 빠른 root를 따라 수렴하는 것을 볼 수 있다.

---

## Linearized optimality condition

Newton's step에 대한 또 다른 해석이 가능하다.<br>
$x$에서 $\nabla f(x+v)=0$이 되는 direction $v$를 찾는 것이다.<br>
$F(x) = \nabla f(x)$라고 하자. 그럼 $F$를 다음과 같이 $x$ 주변에서 first-order approximation으로 **linearizing** 할 수 있다.

$$
0 = F(x+v) \approx F(x) + DF(x)v
$$

위 식의 solution은 $v=-(DF(x))^{-1}F(x) = -(\nabla^2 f(x))^{-1} \nabla f(x)$이 된다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/linearizationofgradient.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Newton's step in linearized optimality condition.<br>
    (from B&V page 486.)
</div>
<br>

위 그림에서 $\Delta x_{nt}=-(\nabla^2 f(x))^{-1} \nabla f(x)$이며 Newton step을 의미한다. 따라서 우리는 Newton step에 대해 $f(x+v)=0$을 만족하는 $v$ 즉, **linearized optimality condition**을 만족하는 스텝을 적용하는 것이라 생각할 수 있다.<br>
따라서 root finding 알고리즘으로 제시되는 Newton's method와 twice differential function의 optimal point를 찾는 알고리즘으로 제시되는 Newton's method는 우연히 이름이 같은 것이 아니라 같은 관점에서 출발한 알고리즘이기 때문인 것이다. (Function의 gradient를 새로운 function으로 보고 root finding 적용 시 optimality에 대한 Newton step이 나옴.)

역사적으로 보면 **Newton (1685)**과 **Raphson (1690)**이 polynomial의 해를 찾는 알고리즘으로 제시했고 **Simpson (1740)**이 이 아이디어를 적용해 일반적인 **nonlinear equation**에서 gradient 함수를 0으로 만드는 최적점을 찾는데 확장시켰다.<br>

## Affine invariance of Newton's method

Newton's method의 중요한 property 중 하나는 **affine invariance**이다.<br>
$f$와 nonsingular $A \in \mathbb{R}^{n \times n}$에 대해 $x=Ay$, $g(y)=f(Ay)$라고 하자.다음 전개 과정을 통해 **affine invariance**를 보일 수 있다.<br>


$$
\begin{aligned}
y^{+}
&= y - (\nabla^{2} g(y))^{-1}\nabla g(y) \\
&= y - (A^{T}\nabla^{2} f(Ay)A)^{-1} A^{T}\nabla f(Ay) \\
&= y - A^{-1}(\nabla^{2} f(Ay))^{-1}\nabla f(Ay)
\end{aligned}
$$

$$
Ay^{+}
= Ay - (\nabla^{2} f(Ay))^{-1}\nabla f(Ay)
$$

$$
x^{+}
= x - (\nabla^{2} f(x))^{-1}\nabla f(x)
$$

정리하자면 변수 $y$에 Newton's method를 적용해 $y^+$를 얻을 수 있다.<br> 이후 $y^+$에 affine transform을 적용하면 $x^+ = Ay^+$가 된다. 이는 먼저 $y$에 affine transform을 적용해 $x=Ay$를 얻은 뒤 $x$에 Newton's method를 적용하는 것과 정확히 동일하다.<br>
따라서 **Newton's method**는 affine invariance를 가지며 문제의 스케일링이나 좌표계 변환에 관계없이 동일한 특성을 보이는 것을 의미한다. **Gradient descent**는 이러한 특성을 가지지 못한다.

---

## Newton Decrement

Point $x$에서 **newton decrement**는 다음과 같이 정의된다.

$$
\lambda(x) = \sqrt{\nabla f(x)^{T}(\nabla^2 f(x))^{-1}\nabla f(x)}
$$

Notation을 간단히 하기 위해 gradient를 $g_x = \nabla f(x)$, hessian을 $H_x = \nabla^2 f(x)$라고 하자. <br>
다음의 식 전개를 통해 newton decrement는 hessian을 이용한 **quadratic approximation**의 **minimum**과 현재 $f(x)$의 차이에 대한 양으로 생각할 수 있다.

$$
\begin{align*}
f(x) - \min_{y} \Big( f(x) + g_x^{T}(y - x)
+ \tfrac{1}{2}(y - x)^{T} H_x (y - x) \Big)
&= f(x) - \Big( f(x) - \tfrac{1}{2} g_x^{T} H_x^{-1} g_x \Big) \\
&= \tfrac{1}{2}\lambda(x)^2
\end{align*}
$$

따라서 $\frac{1}{2}\lambda(x)^2 \le \epsilon$을 stopping condition으로 쓸 수도 있다.

---

### Alternate interpretation of Newton decrement

Newton decrement에 대해서 다른 관점으로도 볼 수 있다.<br>
Point $x$에서 newton direction을 구하면

$$
v_x = -(\nabla^2 f(x))^{-1}\nabla f(x) = -H_x^{-1}g_x
$$

따라서 다음과 같이 decrement를 $x$에서 **hessian**으로 정의된 **norm**에서의 **newton step**의 길이로 볼 수 있다.

$$
\lambda(x) = \sqrt{v_x^{T}H_x v_x} = \Vert v_x \Vert_{H_x}
$$

---

### Affine Invariance of Newton Decrement

일반적인 affine transformation은 다음과 같다.

$$
g(y) = f(Ay + b)
$$

새로운 변수 $x = Ay+b$를 정의하고 아래 식 전개가 가능하다.

$$
\begin{align*}
\lambda_g(y)^2
&= \nabla g(y)^{T} \big(\nabla^2 g(y)\big)^{-1} \nabla g(y) \\[6pt]
\Rightarrow\quad
\lambda_g(y)^2
&= \big(A^{T}\nabla f(x)\big)^{T}
\big(A^{T}\nabla^2 f(x)A\big)^{-1}
A^{T}\nabla f(x) \\[6pt]
\Rightarrow\quad
\lambda_g(y)^2
&= \nabla f(x)^{T}
A A^{-1}
\big(\nabla^2 f(x)\big)^{-1}
(A^{T})^{-1}
A^{T}\nabla f(x) \\[6pt]
\Rightarrow\quad
\lambda_g(y)^2
&= \lambda_f(x)^2
\end{align*}
$$

따라서 newton step처럼 newton decrement도 affine invariant하다.

---

## Backtracking Line Search

지금까지 우리는 **pure Newton's method**를 봤다. 하지만 이 알고리즘은 descent method로 보장되지 못했고 수렴하지 않을 수 있다.<br> 
이를 보완하기 위해 우리는 **damped Newton's method**를 사용한다.<br>
Newton direction은 수용하되 scale을 조정해 descent를 보장하는 방식으로 다음과 같이 구성된다.

$$
x^{+} = x - t \big(\nabla^{2} f(x)\big)^{-1} \nabla f(x) \quad \text{where } t \le 1
$$

Step size $t$를 고르는 방식으로는 **backtracking line search**를 이용한다. 파라미터는 $\alpha \in (0,\frac{1}{2}]$, $\beta \in (0, 1)$로 설정한다.<br>

각 **outer iteration**마다 $t=1$부터 시작해서 아래 **inner loop**를 반복한다.

$$
\begin{aligned}
\text{while } & f(x + t v) > f(x) + \alpha t \nabla f(x)^{T} v \\
              & t = \beta t \\
x &\leftarrow x + t v
\end{aligned}
$$

여기서 $v=-(\nabla^2 f(x))^{-1}\nabla f(x)$이므로 $\nabla f(x)^{T}v = -\lambda(x)^2$이다.<br>
따라서 **loop condition**을 다음과 같이 쓸 수도 있다. 

$$
f(x + t v) > f(x) - \alpha t \lambda(x)^2
$$

$t=1$일 때 보면 loop condition이 의미하는 바는 quadratic approximation의 minimum으로 이동 시 예측되는 함수값과 실제 이동 시의 함수값을 비교해 **step size**를 조정하는 것으로 볼 수 있다.

---

## Example : Logistic Regression

데이터 500개, feature 100개가 있다. <br>
다음은 **logistic regression**을 **Gradient descent (with backtracking)** 와 **Newton's method (with backtracking)** 로 수렴시킨 결과 그래프이다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/gdnmconvergencelogistic.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Convergence comparison gradient descent (black) to Newton's mehtod (blue).
</div>
<br>

결과를 보면 수렴 속도 양상이 확연히 차이나는 것을 알 수 있다. 이후에 더 보겠지만 newton's method는 (locally) quadratic convergence method이다.<br>
Strongly convex problem이므로 $c_1 = (1-\frac{m}{L})$에 대해 gradient descent의 수렴속도를 나타내고 $c_2=\frac{1}{2}$에 대해 Newton's method의 수렴속도를 나타내면 다음과 같다.

$$
\begin{array}{l|l}
\text{Method} & \text{Suboptimality after } k \text{ iterations} \\
\hline
\text{Gradient Descent} & \mathcal{O}(c_1^k) \\
\text{NM (quadratic convergence regime)} & \mathcal{O}(c_2^{2^k})
\end{array}
$$

---

## Convergence Analysis of Newton's method

Newton's method의 수렴 특성 분석을 위해 $f$가 **convex, twice differentiable,** $\text{dom}(f)=\mathbb{R}^n$에 아래 세 가지를 추가로 가정한다.

- $\nabla f$가 parameter $L$에 대해 Lipschitz 연속

- $f$가 parameter $m$에 대해 strongly convex

- $\nabla^2 f$가 parameter $M$에 대해 Lipschitz 연속

<br>

**Theorem**<br>

**Newton's method with backtracking line search**는 아래의 **two-stage convergence bounds**를 만족한다.

$$
f(x^{(k)}) - f^\star \le
\begin{cases}
\bigl(f(x^{(0)}) - f^\star\bigr) - \gamma k, 
& \text{if } k \le k_0, \\[6pt]
\dfrac{2 m^3}{M^2}
\left(\dfrac{1}{2}\right)^{2^{\,k-k_0+1}},
& \text{if } k > k_0 .
\end{cases}
$$

여기서 $\gamma=\alpha \beta^2 \eta^2 m/L^2$, $\eta = \text{min}\lbrace 1, 3(1-2\alpha) \rbrace m^2/M$이며 $k_0$는 $\Vert f(x^{(k_0 +1)})\Vert_2 \lt \eta$를 만족하기 시작하는 step을 의미한다.
<br>

더 구체적으로 살펴보면 Newton's method의 수렴 특성은 $\gamma\gt0$, $0 \lt \eta \le m^2/M$에 대해서 아래의 두 stage로 나뉜다. 이중 **damped phase**는 backtracking line search로 descent를 강제할 때 가지는 수렴 특성이며 **pure phase**는 backtracking line search에 의한 step 크기 감소가 필요없어 $t=1$인 경우를 나타낸다.
<br>

- Damped phase: $\Vert f(x^{(k)})\Vert_2 \ge \eta$인 경우이며

$$
f(x^{(k+1)})-f(x^{(k)}) \le -\gamma
$$

- Pure phase: $\Vert f(x^{(k)})\Vert_2 \lt \eta$인 경우이며 backtracking line search는 $t=1$을 고르고

$$
\frac{M}{2m^2}\Vert f(x^{(k+1)})\Vert_2 \le \left( \frac{M}{2m^2} \Vert \nabla f(x^{(k)})\Vert_2 \right)^2
$$

따라서 $\eta \le m^2/M$일 때 pure phase로 한 번 들어가게 된다면 다음 식에 의해 pure phase를 나가지 않을 것임을 알 수 있다.

$$
\frac{2m^2}{M} \left( \frac{M}{2m^2} \eta \right)^2 \le \eta
$$

결론적으로 Newton's method는 $f(x^{(k)})-f^{\star}\le \epsilon$을 얻기 위해 최대 아래의 **iteration**을 필요로 한다. ($\epsilon_0=2m^3/M^2$)

$$
\frac{f(x^{(0)})-f^{\star}}{\gamma} + \log\log(\epsilon_0/\epsilon)
$$

위와 같이 iteration의 bound는 두 항으로 나뉜다.<br>

$$
\frac{f(x^{(0)})-f^{\star}}{\gamma}
$$

첫 번째 항은 매 iteration마다 최소 $\gamma$만큼 감소하는 선형 감소 구간 iteration을 나타낸다.<br>
Pure phase에 들어가기 전까지 걸리는 단계 수로 볼 수 있다.

$$
\log\log(\frac{\epsilon_0}{\epsilon})
$$

두 번째 항은 pure phase 내부에서의 반복 횟수를 나타내며 **quadratic convergence**의 형태를 띄며 오차가 매 반복마다 제곱으로 줄어든다.<br>

이러한 결과는 quadratic convergence에 대한 **local convergence rate**라고 부른다. 즉, 어떤 $k_0$ 이후에만 이차 수렴이 보장되는 것을 의미한다.

$$
k_0 \le \frac{f(x^{(0)})-f^{\star}}{\gamma}
$$

위 수렴 분석의 중요한 점은 $L, m, M$에 따라 수렴 특성이 달라진다는 것이다.<br>
하지만 앞에서 본 것처럼 **Newton's method** 알고리즘 자체는 **affine invariant**하지만 이러한 수렴 분석은 $L, m, M$에 의존하므로 **affine invariant**하지 않다. 이러한 한계를 보완하기 위해 이후에 **self-concordant function**을 이용한 분석이 등장한다.
<br>

Newton's method convergence analysis의 구체적인 증명 과정은 [[모두를 위한 컨벡스 최적화: 14-05 Convergence analysis of Newton's method]](https://convex-optimization-for-all.github.io/contents/chapter14/2021/03/26/14_05_convergence_analysis/)에 정리되어 있다.<br>

이를 분석해보면 $\Vert \nabla f(x^{k}) \Vert_2 \ge \eta$인 경우, strongly convex+ smooth function에 대한 **backtracking gradient descent**의 convergence theorem과 유사하게 진행된다. 이 stage에서는 **backtracking line search**의 감소율이 하이퍼파라미터 $\alpha, \beta$, gradient 조건 $\eta$, 그리고 곡률 정보 $m, L$에 의해 결정되며 결과적으로 **linear convergence**가 나타난다.<br>

**Damped phase**에서는 $\eta$가 정해졌다고 가정하고 감소 성질을 보지만 **pure phase**에서는 먼저 $\eta$를 어떻게 정해야 $t=1$이 되어 backtracking 없이 수렴되는지 보고자 한다. 이를 위해 **Armijo** 조건의 경계 상황을 분석하여 $t=1$이 허용되는 $\eta$의 상한을 구할 것이다.<br>

Hessian Lipschitz $M$을 이용한 Taylor 근사는 아래와 같다.

$$
f(x+v) \le f(x)+g^T v + \frac{1}{2}v^T Hv + \frac{M}{6}\Vert v \Vert^3
$$

위 식을 Armijo 조건과 비교하기 위해 Newton decrement에 대한 식으로 변환한다.

$$
f(x+v) \le f(x) -\frac{1}{2}\lambda^2 + \frac{M}{6}\Vert v \Vert^3
$$

$$
\Vert v \Vert^3 \le \frac{1}{m^3}\Vert g \Vert^3 \le \frac{\eta}{m^3}\Vert g \Vert^2 \le \frac{\eta L^2}{m^3}\lambda^2
$$

따라서 아래와 같은 식이 나온다.

$$
f(x+v) \le f(x) - \left(\frac{1}{2} - \frac{M\eta}{6m^2}\right)\lambda^2
$$

Armijo 조건을 항상 만족하기 위해서는 마지막 항이 $\alpha \lambda^2$보다 커야한다. 따라서 이를 정리하면

$$
\eta \le \frac{3(1-2\alpha)m^2}{M}
$$

따라서 설정한 $\alpha$에 따라 bound가 다르게 나온다. $0 \lt \alpha \le 1/2$이므로 $\eta \lt 3m^2/M$이며 강의자료에서는 이를 더 단순한 **sufficient condition**으로 $\eta \le m^2/M$으로 나타낸다. 이 조건은 Hessian의 변화율에 따라 Newton의 2차 approximation이 신뢰 가능한 영역을 의미하기도 한다.<br>

**Pure phase**에 진입한 이후에는 **Hessian Lipschitz** 상수 $M$을 이용해 **quadratic convergence**가 나타난다.
각 phase의 세부적인 수렴 분석 과정은 이전에 소개한 참고 자료에 자세히 설명되어 있다.

---

## Self-concordance

**Self-concordant function**을 이용하면 **scale-free analysis**가 가능해진다.
<br>

**Convex function** $f : \mathbb{R} \rightarrow \mathbb{R}$가 아래의 식을 만족하면 **self-concordant**라고 한다.

$$
\vert f^{\prime\prime\prime}(x)\vert \le 2(f^{\prime\prime}(x))^{3/2} \; \; \text{for}\; \text{all } x
$$

Convexity를 만족하면 $f^{\prime\prime}(x) \ge 0$이므로 $(f^{\prime\prime}(x))^{3/2}$이 well defined 된다.<br>

**Multivariate convex function** $f : \mathbb{R}^n \rightarrow \mathbb{R}$가 **self-concordant**일 조건은 아래와 같다.

$$
g(t) = f(x + t v) \text{ is self-concordant } 
\ \ \forall x \in \operatorname{dom}(f),\ \forall v \in \mathbb{R}^n
$$

위 조건의 의미는 $f$를 어떤 line이던 projection하면 self-concordant가 된다는 것이다.

---

### Intuition of self-concordance

기존의 Newton's method의 수렴 분석을 보면 quadratic convergence를 위해 3차 오차항을 **Hessian Lipschitz** 상수 $M$으로 제어하여 곡률의 변화를 발산하지 않고 Newton step과 비교 가능하도록 제한한 뒤 분석을 진행했다.<br>
**Self-concordant function**은 이러한 관점을 가져와 3차항이 2차항의 function으로 직접 bound되도록 만든 함수이다. 따라서 해당 함수에 대한 **Newton's method**의 **convergence theorem**은 3차 오차항의 상한이 함수 자체에 의해 자연스럽게 주어지며 추가적인 $L, m, M$ 등의 정의가 필요없게 되며 최종적으로 **scale-free(affine invariant)** 분석이 가능하게 된다.<br>
여기서 그럼 드는 의문은 왜 self-concordance 정의에서 지수항이 $3/2$이고 계수로 2가 붙는가이다. 결론부터 말하면 scale-free를 위해 계수는 반드시 2일 필요는 없지만 지수항은 반드시 $3/2$이어야 한다. 계수에 대한 내용은 이후 self-concordant 함수의 **property**에서 다루어지므로 여기서는 지수항의 필연성에 대해서 알아보자.<br>

우리가 원하는 것은 Newton step에 대한 오차항을 **affine invariant**한 **Newton decrement** $\lambda$로만 제어하는 것이다.<br>
먼저 아래의 Taylor 전개를 보자.

$$
f(x+v)=f(x) + f^{\prime}(x)v + \frac{1}{2}f^{\prime\prime}(x)v^2 + R_3
$$

$R_3$는 3차항 이상의 오차항을 의미하며 $v\rightarrow 0$ 일수록 3차 오차항이 전체의 크기를 결정짓게 된다. 따라서 다음 식과 같이 나타낼 수 있다.

$$
\vert R_3 \vert \approx \frac{1}{6}\vert f^{\prime\prime\prime}(\xi)\vert \vert v \vert^3
$$

즉, Newton 분석에서 핵심적으로 제어해야 할 항은

$$
\vert f^{\prime\prime\prime} \vert \; \vert v \vert^3
$$

이제 Newton step의 자연스러운 scale을 보자.<br>
Newton step은

$$
v_{nt} = -\frac{f^{\prime}(x)}{f^{\prime \prime}(x)}
$$

$$
\lambda(x)^2 = \frac{(f^{\prime}(x))^2}{f^{\prime\prime}(x)} \quad \Rightarrow \quad \vert f^{\prime}(x) \vert = \lambda \sqrt{f^{\prime \prime}(x)}
$$

따라서 Newton step의 크기를 $\lambda$로 표현하면

$$
\vert v_{nt}\vert = \frac{\vert f^{\prime}\vert}{f^{\prime\prime}} = \frac{\lambda \sqrt{f^{\prime\prime}}}{f^{\prime\prime}} = \frac{\lambda}{\sqrt{f^{\prime\prime}}}
$$

위 결과를 가지고 이제 $\vert f^{\prime\prime\prime}(x)\vert \le C (f^{\prime\prime}(x))^p$를 만족하는 scale free $p$를 찾아보자.<br>
이전에 구한 $R_3$의 스케일을 보면

$$
\vert R_3 \vert \approx \vert f^{\prime \prime \prime} \vert \; \vert v_{nt}\vert^3 \le C(f^{\prime\prime})^p \cdot \frac{\lambda^3}{(f^{\prime\prime})^{3/2}} = C\lambda^3 (f^{\prime\prime})^{p-3/2}
$$

따라서 다음 조건을 만족해야 곡률의 변화량 제어를 affine invariant하게 Newton decrement로만 할 수 있게 되는 것이다.

$$
p = \frac{3}{2}
$$

다시 정리하면 Newton's method의 convergence analysis를 위해서는 Newton's method가 목적함수의 quadratic approximation의 최솟값을 사용하므로 3차 오차항인 곡률 변화량의 상한을 적절히 제어해야 수렴과 수렴 속도를 논할 수 있다.<br>
이를 위해 

$$
\vert f^{\prime\prime\prime}(x)\vert \le C (f^{\prime\prime}(x))^p
$$

형태의 bound를 가정하고 **scale-free** 관점에서 분석해보면 $p=3/2$일 때에만 approximation의 오차항이 affine invariant한 **Newton decrement** $\lambda$로 제어되는 것을 알 수 있다.

---

### Convergence analysis via Self-concordance

Self-concordant function에 대해 Newton's method의 convergence analysis를 진행하면 **affine invariant bound**를 얻을 수 있다.<br>
Newton's method (backtracking line search)로 $\epsilon$ **suboptimal point**로 도달하기 위해서는 최대 아래 식의 iteration을 필요로 한다.

$$
C(\alpha, \beta)(f(x^{(0)})-f^{\star}) + \log\log\left(\frac{1}{\epsilon}\right)
$$

여기서 $C(\alpha, \beta)$는 $\alpha, \beta$에 의해 결정되는 상수이며 $m, M$ 등 기존 분석에 필요한 상수들이 필요없다.<br>

---

### Self Concordance Function Examples

대표적인 몇 가지 self-concordant function을 알아보자.<br>
- **Linear functions (LP)**
<br>

- **Quadratic functions (QP)**
<br>

- 
$$
f(X) = -\log(\det(X)) \; \; \text{on} \; \; \mathbb{S}^n_{++}
$$
<br>

- 
$$
f(x) = -\sum^{n}_{i=1} \log(x_i) \; \; \text{on}\; \; \mathbb{R^n_{++}}
$$
<br>

- $g$ : **Self-concordant** $\longrightarrow$ $f(x) = g(Ax+b)$ **also self-concordant**
<br>

- Definition의 계수 2는 general $\kappa$로 대체 가능하다.
<br>

- $g$ : $\kappa$**-self-concordant** $\longrightarrow$ $f(x) = \frac{\kappa}{4}g(x)$ : **2-self-concordant**

Self-concordance 정의에 등장하는 계수는 함수의 스케일링에 따라 조정 가능하며 일반적인 $\kappa$-self-concordant 함수는 적절한 상수배를 통해 표준적인 2-self-concordant 형태로 항상 정규화할 수 있다.

---

## Comparison to 1st-order methods

| 항목 | Gradient descent | Newton's method |
| :----------- | :------------: | :------------: |
| **Memory**       |    $\mathcal{O}(n)$(gradient)    |    $\mathcal{O}(n^2)$(Hessian)    |
| **Computation**       |    $\mathcal{O}(n)$(벡터 계산)    |    $\mathcal{O}(n^3)$(Hessian이 포함된 선형 시스템 계산)    |
| **Backtracking**       |    $\mathcal{O}(n)$    |    $\mathcal{O}(n)$    |
| **Conditioning**       |    Problem's conditioning에 비교적 취약    |    Affine invariance에 의해 영향 받지 않음    |

<br>
위 표에서 backtracking line search의 연산 속도는 비슷한 것을 볼 수 있는데, 이는 Armijo 조건을 만족할 때까지 step size를 줄이는 과정이 벡터 스케일링과 함수값 평가로 이루어진 비교적 단순한 연산이기 때문이다.<br>

다음 그림은 x축을 실제 연산에 걸린 시간으로 설정하여 두 알고리즘의 수렴 속도를 비교한 그래프이다. 한 iteration에 걸리는 시간은 Newton's method가 더 많지만 몇 개의 step만으로 더 수렴이 많이 진행돼 더 빠른 수렴 속도를 가지는 것을 볼 수 있다.

<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/logisticregressiongdnm.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Logistic regression example<br>
    x-axis(time taken per iteration)
</div>
<br>

---

## Sparse, structured problems

Newton's method의 computation은 **Hessian**이 포함된 선형시스템의 해를 구해야 하며 $\mathcal{O}(n^3)$으로 매우 크다.<br>
하지만 Hessian이 **sparse / structured matrix** 인 경우 [band matrix](https://en.wikipedia.org/wiki/Band_matrix)라고 부르며 $\mathcal{O}(n)$의 computation이 소모된다.

$$
H = v g \left\{
\begin{array}{ll}
O(n^3) & H:\ \text{Dense} \\
O(n)   & H:\ \text{Banded}
\end{array}
\right.
$$

언제 **structured Hessian**을 가지는지 두 가지 예시를 보자.
<br>

- 만약 $g(\beta) = f(X\beta)$라면 $\nabla^2 g(\beta) = X^{T}\nabla^2 f(X\beta)X$이다. 따라서 만약 $X$가 **structured predictor matrix**고 $\nabla^2 f$가 **diagonal matrix**라면 $\nabla^2g$는 **structured matrix**이다.

- $f(\beta)+g(D\beta)$를 minimize하는 문제를 보자. 여기서 $\nabla^2 f$는 **diagonal**, $g$는 **not smooth**, $D$는 **structured penalty matrix**이다. 이 문제의 **Lagrange dual function**은 $-f^{\ast}(-D^{T}u) - g^{\ast}(-u)$이다.<br> 
따라서 Lagrange dual function의 **Hessian**은 $
D \nabla^2 f^{\ast}(-D^{T}u)D^T + \nabla^2 g^{\ast}(-u)$ 이다. <br>
$\nabla^2 f^{\ast}$도 diagonal로 유지되는 경우가 자주 있는데 이런 경우에는 첫 항이 **structured matrix**가 되어 primal의 경우 $g$에 포함됐던 $D$를 dual의 $f$에서 쉽게 처리할 수 있게 된다.

---

## Equality-constrained Newton's Method

지금까지는 constraints가 없는 problem에 대한 Newton's method를 다뤘다.<br>
여기서는 **equality constrained problem**에 대한 Newton's method를 소개할 것이다.<br>
다음과 같은 문제를 생각하자.

$$
\begin{aligned}
\min_{x}\ & f(x) \\
\text{subject to }\ & Ax = b
\end{aligned}
$$

위 문제를 해결하는 방법은 아래 세 가지가 있다.<br>

- **Equality constraints 제거**: $x=Fy+x_0$로 변환해 $y$에 대한 문제로 바꿔 푼다. 여기서 $F$는 $A$의 null space를 span하는 matrix이며 $Ax_0 = b$이다.

- **Deriving the dual**: 위 문제의 Lagrange dual function은 $-f^{\ast}(-A^{T}v)-b^{T}v$이고 strong duality는 성립한다. 운좋으면 $x^{\star}$가 $v^{\star}$에 대한 식으로 표현될 수 있다.

- **Equality-constrained Newton**: 많은 경우에 이 방법을 사용한다. 아래에 더 자세히 설명하겠다.

Equality-constrained Newton's method은 다음과 같다. 먼저 $Ax^{(0)}=b$를 만족하는 $x^{(0)}$을 찾는다. 그리고 아래 과정을 반복해 업데이트를 진행한다.

$$
\begin{aligned}
x^{+} &= x + t v, \quad \text{where} \\
v &= \underset{Az=0}{\operatorname{argmin}}
\left(
\nabla f(x)^{T}(z - x)
+ \frac{1}{2}(z - x)^{T} \nabla^{2} f(x) (z - x)
\right)
\end{aligned}
$$

이 과정은 $x^{+}$가 feasible set 내부를 유지하도록 한다.<br> 
($Ax^+ =  Ax + tAv = b+0 = b$)
<br>

따라서 Newton step $v$는 **quadratic function**을 최소화하는 **equality constrained problem**의 solution으로 볼 수 있다. **KKT condition**을 가져오면

$$
\begin{pmatrix}
\nabla^{2} f(x) & A^{T} \\
A & 0
\end{pmatrix}
\begin{pmatrix}
v \\
w
\end{pmatrix}
=
\begin{pmatrix}
-\nabla f(x) \\
0
\end{pmatrix}
$$

위의 solution $v$를 이용해 Newton step을 진행할 수 있다.

---

## Quasi-Newton methods

만약 Hessian이 너무 **expensive**하거나 **singular**하다면 $\nabla^2 f(x)$를 $H\succ 0$으로 approximate하고 아래 식으로 업데이트한다.

$$
x^{+} = x - t H^{-1}\nabla f(x)
$$

- **Approximate Hessian** $H$는 매 스텝마다 다시 계산되며 $H^{-1}$이 저렴하도록 만들어진다.

- Convergence는 **superlinear**이며 Newton과 동일하진 않다.

- **Quasi-Newton methods**에는 매우 다양한 형태가 존재하며 $H$를 **propagate** 해나가는 방식을 공통적으로 사용한다.