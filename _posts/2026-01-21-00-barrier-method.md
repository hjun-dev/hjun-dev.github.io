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
