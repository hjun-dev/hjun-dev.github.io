---
layout: post
title: "[Convex Optimization] 17. Quasi Newton Method"
description: "Newton Method의 헤시안을 근사하는 Second-order method"
date: 2026-03-16 13:00:00 +0900
tags: [math, study, CMU 10-725]
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

이 포스트에서는 Second-order method 중 하나인 Quasi-Newton method에 대해 알아볼 것이다. Newton method의 가장 큰 문제점인 연산 시간 문제를 해결하기 위해 나온 방법이다.

---

## Motivation for Quasi-Newton Method

다음과 같은 unconstrained smooth convex optimization problem을 생각해 보자.

$$
\min_x f(x)
$$

Gradient descent는 global linear convergence하며 Newton's method는 local quadratic convergence한다.<br>
하지만 gradient descent iteration의 cost는 $\mathcal{O}(n)$인 반면에 Newton iteration은 $\mathcal{O}(n^3)$이다.
- Gradient descent
$$
x^+ =x- t\nabla f(x) \\
$$
- Newton's method
$$
x^+ =x- t(\nabla^2 f(x))^{-1}\nabla f(x)
$$ 

따라서 수렴에 걸리는 iteration의 수는 Newton's method가 gradient descent보다 적을 수 있지만 차원이 커질수록 한 iteration의 크기가 지나치게 오래걸리게 된다.<br>
이 문제를 해결하기 위해서 Quasi-Newton method가 제시되었다. Quasi-Newton method는 superlinear convergence하며 각 iteration의 cost는 $\mathcal{O}(n^2)$이다. 이론적으로는 $n$ Quasi-Newton step이 한 Newton step만큼 걸리지만 실제로는 훨씬 빠른 경우가 많다고 한다.

---

## Quasi-Newton Template


$x^{(0)}\in \mathbb{R}^n, B^{(0)}\succ 0 $을 설정한 뒤 $k=1,2,3,\ldots,$에 대해 아래 단계를 반복한다:<br>
1. Solve $B^{(k-1)}s^{(k-1)}=-\nabla f(x^{(k-1)})$
2. Update $x^{(k)} = x^{(k-1)}+t_k s^{(k-1)}$
3. Compute $B^{(k)}$ from $B^{(k-1)}$

Quasi-Newton method의 종류에 따라 Step 3를 다르게 계산한다. Basic idea는 $B^{(k-1)}$가  헤시안에 대한 정보를 담고 있을 때 어떻게 적절한 $B^{(k)}$를 구할 것이냐이다.<br>
적절한 $B^{(k)}$가 가져야 하는 성질들은 다음과 같다.<br>

- **Secant Equation**<br>

Gradient의 변화를 아래와 같이 근사할 수 있다.
$$
\nabla f(x^+) = \nabla f(x) + B^+ s
$$

$y = \nabla f(x^+)-\nabla f(x)$로 두면 아래와 같은 **secant equation**이 나온다.

$$
B^+ s = y
$$

- $B^+$가 symmetric

- $B$와 "close"한 $B^+$

- $B\succ 0 \Rightarrow B^+ \succ 0$

---

## Updating $B^+$

### Symmetric Rank One Update (SR1)

Rank 1 update의 form은 다음과 같다.

$$
B^+ = B + auu^T
$$

이를 secant equation에 대입하면

$$
(au^T s)u = y - Bs
$$

위 식을 만족하는 $a$와 $u$가 존재하기 위해서는 $u$가 $y-Bs$와 평행해야 한다.<br>
$u=y-Bs$를 사용하면 $a=\frac{1}{(y-Bs)^T s}$가 나온다.<br>
따라서 $B^+$의 식은 다음과 같다.

$$
B^+ = B + \frac{(y-Bs)(y-Bs)^T}{(y-Bs)^Ts}
$$

Quasi-Newton method를 적용하기 위해서는 $B^+ s^+ = -\nabla f(x^+)$를 구해야 한다. 이를 효율적으로 하기 위해 inverse를 propagate하는 방식을 취한다.<br>
[Sherman-Morrison Formula](https://en.wikipedia.org/wiki/Sherman%E2%80%93Morrison_formula)를 이용해 $C=B^{-1}$로 $C^+=(B^+)^{-1}$을 구한다.

$$
(A+uv^T)^{-1} = A^{-1} - \frac{A^{-1}uv^T A^{-1}}{1+v^T A^{-1}u}
$$

따라서 SR1 update에 따른 inverse update도 다음과 같이 쉽게 구할 수 있다.

$$
C^+ = C + \frac{(s-Cy)(s-Cy)^T}{(s-Cy)^T y}
$$

일반적으로 SR1은 간단하고 저렴하지만 중요한 문제가 있다. Positive definiteness가 보장되지 않는 것이다. 따라서 사용되지 않는다.

---

### Broyden-Fletcher-Goldfarb-Shanno Update (Rank Two)

이번에는 rank 2 update를 진행해보자.

$$
B^+ = B + auu^T + b vv^T
$$

Secant equation에 대입하면

$$
y - Bs = (au^T s)u + (bv^T s)v
$$

$y-Bs$는 $u$와 $v$의 선형 결합으로 나타나야 한다. 따라서 $u=y, v=Bs$로 두고 $a, b$를 구하면

$$
B^+ = B - \frac{Bss^T B}{s^T Bs} + \frac{yy^T}{y^T s}
$$

이를 **Broyden-Fletcher-Goldfarb-Shanno (BFGS)** update라고 부른다.<br>
SR1처럼 역행렬을 propagation하기 위해서 다음과 같은 [Woodbury formula](https://en.wikipedia.org/wiki/Woodbury_matrix_identity)를 사용한다. (Sherman-Morrison의 일반화 버전)

$$
(A + UCV)^{-1} = A^{-1} - A^{-1} U (C^{-1} + VA^{-1}U)^{-1}V A^{-1}
$$

따라서 inverse $C$에 대한 rank 2 update는 다음과 같다.

$$
\begin{aligned}
C^{+} &= C + \frac{(s - C y)s^{T}}{y^{T}s}
      + \frac{s(s - C y)^{T}}{y^{T}s}
      - \frac{(s - C y)^{T}y}{(y^{T}s)^{2}} ss^{T} \\
&= \left(I - \frac{s y^{T}}{y^{T}s}\right)
   C
   \left(I - \frac{y s^{T}}{y^{T}s}\right)
   + \frac{s s^{T}}{y^{T}s}
\end{aligned}
$$

BFGS update는 $\mathcal{O}(n^2)$이므로 여전히 가볍다.<br>
SR1과는 달리 BFGS는 positive definiteness를 보존한다. ($B\succ 0 \Rightarrow B^+ \succ 0$ 혹은 $C\succ 0 \Rightarrow C^+ \succ 0$)를 보이면 된다.<br>

$$
x^{T} C^{+} x
=
\left(
x - \frac{s^{T}x}{y^{T}s}y
\right)^{T}
C
\left(
x - \frac{s^{T}x}{y^{T}s}y
\right)
+
\frac{(s^{T}x)^{2}}{y^{T}s}
$$

첫 항은 $C\succ 0$이므로 $\ge 0$이며 두 번째 항은 $y^T s \ge 0$이라면 $\ge 0$이다. 또한 각 항이 0이 되는 경우 다른 항이 0이 아니게 되어 $C^+$는 positive definite하게 된다. <br>
Convex function은 다음과 같은 monotonicity를 가진다.

$$
y^Ts = (\nabla f(x^+) - \nabla f(x))^T (x^+ - x) \ge 0
$$

$0$이 되는 것을 피하기 위해 후에 BFGS로 찾은 방향으로 line search하여 $y^T s\gt 0$으로 강제한다.

---

### Davidon-Fletcher-Powell update

이번엔 조금 다른 관점으로 생각해보자. BFGS로 $B$를 rank 2 update하고 $C=B^{-1}$로 바꿔 복잡하게 하지 말고 바로 $C$를 rank 2 update하는건 어떨까?

$$
C^+ = C + auu^T + bvv^T
$$

Secant equation $s = C^+ y$에 대입하고 $a, b$를 찾으면

$$
C^{+}
=
C
-
\frac{Cyy^{T}C}{y^{T}Cy}
+
\frac{ss^{T}}{y^{T}s}
$$

Woodbury를 적용하면

$$
B^{+}
=
\left(
I - \frac{y s^{T}}{y^{T}s}
\right)
B
\left(
I - \frac{s y^{T}}{y^{T}s}
\right)
+
\frac{y y^{T}}{y^{T}s}
$$

이러한 method를 **David-Fletcher-Powell (DFP)**라고 부른다. BFGS와 같이 연산 속도가 $\mathcal{O}(n^2)$이며 positive definiteness를 보존하지만 BFGS만큼 자주 사용되지는 않는다.

---

### Alternate Motivation for DFP

$B^+ \succ 0, B^+ s = y$라고 하면

$$
y^T s = s^T B^+ s \gt 0
$$

이를 **curvature condition**라고 부르며 이를 만족하는 $M \succ 0 \ \ \text{s.t.} \ Ms = y$가 존재하게 된다.<br>

DFP의 결과는 다른 관점으로도 도출할 수 있다. $B$와 가장 가까운 $B^+$를 찾는 문제를 보면

$$
\begin{aligned}
\min_{B^{+}} \quad & \left\| W^{-1}(B^{+}-B)W^{-T} \right\|_{F} \\
\text{subject to} \quad & B^{+} = (B^{+})^{T} \\
& B^{+} s = y
\end{aligned}
$$

여기서 $W$는 nonsingular하며 $WW^T s = y$를 만족한다. BFGS 역시 같은 문제를 풀지만 $B$와 $C$가 바뀐다.

---

## Other Quasi-Newtonian Updates

지금까지 본 SR1, DFP, BFGS 이외에도 많은 quasi-Newtonian updates가 가능하다.

---

### Broyden Class

위와 같은 quasi-Newtonian updates의 집합을 **Broyden Class**로 정의할 수 있다.<br>

$$
B^+ = (1-\phi) B^+_{\text{BFGS}} + \phi B^+_{\text{DFP}}, \quad \phi \in \mathbb{R}
$$

$v = y/(y^Ts) - Bs/(s^T B s)$에 대해서 아래와 같이 다시 쓸 수 있다.

$$
B^{+}
=
B
-
\frac{B s s^{T} B}{s^{T} B s}
+
\frac{y y^{T}}{y^{T} s}
+
\phi(s^{T} B s)\, v v^{T}
$$

- BFGS는 $\phi = 0$

- DFS는 $\phi = 1$

- SR1는 $\phi = y^T s / (y^T s - s^T Bs)$

---

## Convergence Analysis

$f$가 convex, twice differentiable라면 $\text{dom}(f) = \mathbb{R}^n$에 대해서 다음이 만족한다고 하자.
- $\nabla f$ is Lipschitz with parameter $L$

- $f$ is strongly convex with parameter $m$

- $\nabla^2 f$ is Lipschitz with parameter $M$

이는 Newton's method의 analysis에서와 같은 조건이다.

---
**Theorem:** DFP and BFGS, with backtracking line search, converge globally. Furthermore, for all $k \ge k_0$,

$$
\Vert x^{(k)} - x^{\star}\Vert_2 \le c_k \Vert x^{(k-1)} - x^{\star}\Vert_2
$$

where $c_k \rightarrow 0$ as $k \rightarrow \infty$. Here $k_0, c_k$ depend on $L, m, M$

---

이걸 **local superlinear convergence**라고 한다.

---

## Implicit-Form quasi-Newton

Quasi-Newton methods는 newton updates에 비해서는 훨씬 가볍지만 아직 $\mathcal{O}(n^2)$의 메모리와 시간이 걸린다. 만약 $n$이 크면 $C$를 만드는 것도 힘들어진다.<br>
이 문제를 해결하기 위해 $C$를 직접 계산하고 저장하는 대신에 모든 $(y, s)$ pair를 저장하고 implicit version을 사용한다. 이 방식은 특히 $k << n$인 경우 더 유용하다.<br>
아래와 같은 결과를 보면

$$
C^+ = (I-\frac{sy^T}{y^T s})C(I-\frac{ys^T}{y^T s}) + \frac{ss^T}{y^T s}
$$

모든 $(y, s)$ pair를 가지고 있다면 $C^+$를 계산할 수 있다.<br>
하지만 대신에 각 iteration마다 $C^+g$를 바로 계산한다면 더 유용할 것이다.<br>
구체적인 방법은 $k$ 길이의 두 loop를 이용하는 다음의 알고리즘과 같다.

---

### IFQN Algorithm

1. Let $q = -\nabla f(x^k)$
2. For $i = k-1, \ldots, 0:$ <br>
(a) Compute $\alpha_i = (s^{(i)})^T q / ((y^{(i)})^T s^{(i)})$ <br>
(b) Update $q=q-\alpha y^{(i)}$

3. Let $p=C^{(0)}q$

4. For $i = 0, \ldots, k-1:$ 
<br>
(a) Compute $\beta = (y^{(i)})^T p / ((y^{(i)})^T s^{(i)})$ <br>
(b) Update $p=p+ (\alpha_i - \beta)$

5. return $p$

---

**Complexity Analysis**<br>

Explicit form(Original)은 $n^2$ 메모리와 연산시간을 필요로 한다. 따라서 $k$ 스텝의 경우 $\mathcal{O}(kn^2)$의 연산시간이 걸린다.<br>
Implicit form(IFQN)은 $n$사이즈의 $(y, s)$ pair들을 $k$ iteration 동안 저장해야 하므로 $\mathcal{O}(kn)$의 메모리를 필요로 한다. 또한 $k$ step에 대해 $\mathcal{O}(k^2n)$의 시간이 걸린다.<br>
결론적으로 $k << n$라면 IFQN은 많은 장점을 가진다.

---

## Limited memory BFGS

IFQN은 iteration $k$가 너무 늘어날 경우 원래의 메모리와 연산속도 문제가 해결되지 않을 수 있다.<br>
이를 해결하기 위해 Limited memory BFGS(LBFGS)가 제안되었다.
<br>

1. Let $q = -\nabla f(x^k)$
2. For $i = k-1, \ldots, k-m:$ <br>
(a) Compute $\alpha_i = (s^{(i)})^T q / ((y^{(i)})^T s^{(i)})$ <br>
(b) Update $q=q-\alpha y^{(i)}$

3. Let $p=\bar{C}^{(k-m)}q$

4. For $i = k-m, \ldots, k-1:$ 
<br>
(a) Compute $\beta = (y^{(i)})^T p / ((y^{(i)})^T s^{(i)})$ <br>
(b) Update $p=p+ (\alpha_i - \beta)$

5. return $p$

<br>

$\bar{C}^{(k-m)}$은 $C^{(k-m)}$의 guess이며 실제로 저장해서 쓰지 않는다. 일반적으로는 $\bar{C}^{(k-m)}=I$로 두며 더 복잡한 선택들도 존재한다.

---

## Stochastic quasi-Newton methods

다음 문제를 생각해보자.

$$
\min_x \mathbb{E}_\xi[f(x,\xi)]
$$

여기서 $\xi$는 noisy random 변수이다.<br>
이전 아이디어를 확장해서 다음과 같은 stochastic quasi-Newton update를 사용하는 것이 자연스럽다.

$$
x^{(k)} = x^{(k-1)} - t_k C^{(k-1)}\nabla f(x^{(k-1)}, \xi_k)
$$

하지만 몇 가지 어려움이 존재한다.

- 최대로 얻을 수 있는 이론적 수렴 속도는 sublinear이다. 따라서 SGD보다 가치가 있다고 확신하기 어렵다.

- $C$의 업데이트는 연속된 gradient 추정값에 의존하는데 gradient의 노이즈가 문제를 일으킬 수 있다.

---

가장 단순하게는 아래 식으로 BFGS (또는 LBFGS)를 이용하는 것이다.

$$
s^{(k-1)} = x^{(k)} - x^{(k-1)}
$$

$$
y^{(k-1)} = \nabla f(x^{(k)},\xi_k) - \nabla f(x^{(k-1)}, \xi_k)
$$

이 방법은 Schraudolph et al. (2007)에 의해 제안되었다.<br>
이후에도 계속 연구가 진행되고 있다.

---