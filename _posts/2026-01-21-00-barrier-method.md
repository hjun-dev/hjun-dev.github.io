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

