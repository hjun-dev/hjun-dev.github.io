---
layout: post
title: "[Convex Optimization] 10. Duality in linear programs"
description: "LP에서의 Duality 분석"
date: 2026-01-05 13:00:00 +0900
tags: [math, study]
categories: [optimization]
related_posts: false
toc:
  sidebar: left
---

## 10.1 Lower Bounds in Linear Programs

Duality에 대한 이해를 위해 먼저 linear programs에서 optimal value의 lower bound를 찾아보자. ($B \le \min_{x} f(x)$)

다음과 같은 간단한 LP를 살펴보자.
$$
\begin{aligned}
\min_{x, y} \quad & x + y \\
\text{subject to} \quad 
& x + y \ge 2, \\
& x, y \ge 0.
\end{aligned}
$$
위 문제의 lower bound는 제약함수를 통해 $B$=2임을 쉽게 알 수 있다.

이번엔 다른 LP를 보자.
$$
\begin{aligned}
\min_{x, y} \quad & x + 3 y \\
\text{subject to} \quad 
& x + y \ge 2, \\
& x, y \ge 0.
\end{aligned}
$$
위 문제의 lower bound는 $x + y \ge 2$와 $2y \ge 0$를 더한 $x + 3y \ge 2$를 통해 $B$=2임을 구할 수 있다.

다음의 일반적인 LP를 가정하자.
$$
\begin{aligned}
\min_{x, y} \quad & p x + q y \\
\text{subject to} \quad 
& x + y \ge 2, \\
& x \ge 0,\; y \ge 0.
\end{aligned}
$$
위 문제의 lower bound는 아래 식을 통해 $B=2a$가 나온다.
$$
\begin{aligned}
a + b = p\\
a + c = q\\
a, b, c \ge 0
\end{aligned}
$$

위에서 구한 lower bound $B$를 maximize함으로써 우리는 가장 유용한? lower bound를 구할 수 있다.
$$
\begin{array}{c|c}
\begin{aligned}
\min_{x,y} \quad & p x + q y \\
\text{subject to} \quad
& x + y \ge 2 \\
& x, y \ge 0
\end{aligned}
&
\begin{aligned}
\max_{a,b,c} \quad & 2a \\
\text{subject to} \quad
& a + b = p \\
& a + c = q \\
& a, b, c \ge 0
\end{aligned}
\\[1em]
\text{Called primal LP}
&
\text{Called dual LP}
\end{array}
$$
참고: dual variables의 개수는 primal constraints의 개수와 같다.

또 다른 문제에 적용해보면
$$
\begin{array}{c|c}
\begin{aligned}
\min_{x,y} \quad & p x + q y \\
\text{subject to} \quad
& x \ge 0 \\
& y \le 0 \\
& 3x + y = 2
\end{aligned}
&
\begin{aligned}
\max_{a,b,c} \quad & 2c - b \\
\text{subject to} \quad
& a + 3c = p \\
& -b + c = q \\
& a, b \ge 0
\end{aligned}
\\[1em]
\text{Primal LP}
&
\text{Dual LP}
\end{array}
$$
위 형태를 보면 알 수 있듯이 equality constraint에 대한 dual variable은 부호 제약이 없다.

## 10.2 Duality for general form LP

$c \in \mathbb{R}^n$, $A \in \mathbb{R}^{m \times n}$, $b \in \mathbb{R}^m$, $G \in \mathbb{R}^{r \times n}$, $h \in \mathbb{R}^r$에 대해 general form LP에서의 primal과 dual problem은 다음과 같다.
$$
\begin{array}{c|c}
\begin{aligned}
\min_{x,y} \quad & c^T x \\
\text{subject to} \quad
& Ax = b \\
& Gx \le h 
\end{aligned}
&
\begin{aligned}
\max_{a,b,c} \quad & -b^T u -h^T v \\
\text{subject to} \quad
& - A^T u - G^T v = c \\
& v \ge 0
\end{aligned}
\\[1em]
\text{Primal LP}
&
\text{Dual LP}
\end{array}
$$
이는 primal problem에 대해,
$$
u^{T}(Ax - b) + v^{T}(Gx - h) \le 0
\;\;\Longleftrightarrow\;\;
(-A^{T}u - G^{T}v)^{T}x \ge -\,b^{T}u - h^{T}v
$$
따라서 $c = -A^T u - G^T v$라면 primal optimal value의 lower bound를 구할 수 있다.

