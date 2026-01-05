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

위 문제의 lower bound는 제약함수를 통해 $B=2$를 쉽게 알 수 있다.

이번엔 다른 LP를 보자.

$$
\begin{aligned}
\min_{x, y} \quad & x + 3 y \\
\text{subject to} \quad 
& x + y \ge 2, \\
& x, y \ge 0.
\end{aligned}
$$

위 문제의 lower bound는 $x + y \ge 2$와 $2y \ge 0$를 더한 $x + 3y \ge 2$를 통해 $B=2$를 구할 수 있다.

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

위에서 구한 lower bound $B$를 maximize함으로써 우리는 가장 유용한(?) lower bound를 구할 수 있다.

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

## Example: max flow and min cut

Max flow problem은 시작 지점(source)에서 종료 지점(sink)까지 전달되는 유량의 총합을 가장 크게 만드는 문제이며 이는 Min cut problem과 강한 이론적 관계를 가진다.
(해당 문제의 역사적 배경에 대해서는 "On the fistory of transportation and maximum flow problems, Schrijver (2002)"에 정리되어 있다.)

### Flow
Flow는 파이프 내부를 흘러가는 액체 등의 유량을 생각하면 된다. 따라서 이는 nonnegative이며 파이프 내부의 capacity는 제한되어 있고 mass는 진행 중 줄지 않는다.
위 내용을 formal하게 표현하기 위해 directed graph $G=(V, E)$를 고려한다. 시작 지점(source)의 node는 $s$, 종료 지점(sink)의 node는 $t$로 설정하며 flow는 $(i, j)\in E$에 대해 벡터 $f_{ij}$로 나타낸다. Flow의 제약은 아래와 같다.

* Nonnegativity of flow being pushed in the direction of the edge: $f_{ij} \ge 0, (i,j)\in E$
* Flow capacity per edge: $f_{ij} \le c_{ij}, (i,j)\in E$

* Conservation of flow (except source / sink nodes):  
$$
\sum_{(i,k)\in E} f_{ik}
=\sum_{(k,j)\in E} f_{kj},
\quad k \in V \setminus \{s,t\}$$  
(나가는 유량과 들어오는 유량은 같다. (source & sink 제외))

그래프이미지그래프이미지그래프이미지그래프이미지그래프이미지그래프이미지그래프이미지그래프이미지그래프이미지

### Max flow problem
주어진 그래프에서 Max flow를 만족하기 위해서 우리는 sourse $s$에서 방출되는 유량의 합을 maximize하길 원한다. 이를 LP(Linear Program)으로 나타내면 아래와 같다.

$$
\begin{aligned}
\max_{f \in \mathbb{R}^{|E|}} \quad
& \sum_{(s,j)\in E} f_{sj} \\[0.5em]
\text{subject to} \quad
& 0 \le f_{ij} \le c_{ij}, 
\qquad \forall (i,j)\in E, \\[0.5em]
& \sum_{(i,k)\in E} f_{ik}
=
\sum_{(k,j)\in E} f_{kj},
\qquad \forall k \in V \setminus \{s,t\}.
\end{aligned}
$$

### Deriving the dual
LP를 primal에서 dual problem으로 변환하는 방법을 다시 생각해보면 primal 문제의 constraints에 dual variables을 곱하고 정리해 objective function의 lower bound를 구하고 이를 maximize한다. 이를 위해 primal problem의 constraints에 아래와 같이 dual variable을 곱한다.

$$
\begin{aligned}
\max_{f \in \mathbb{R}^{|E|}} \quad
& \sum_{(s,j)\in E} f_{sj} \\[0.5em]
\text{subject to} \quad
& -a_{ij} f_{ij} \le 0,
\qquad \forall (i,j)\in E, \\[0.5em]
& b_{ij} f_{ij} \le b_{ij} c_{ij},
\qquad \forall (i,j)\in E, \\[0.5em]
& x_k
\left(
\sum_{(i,k)\in E} f_{ik}
-
\sum_{(k,j)\in E} f_{kj}
\right)
= 0,
\qquad \forall k \in V \setminus \{s,t\}.
\end{aligned}
$$

전부 더해 $a_{ij}, b_{ij}\ge 0$, $(i,j)\in E$, $x_{k}, k \in V \setminus{s,t}$에 대해 정리하면

$$
\sum_{(i,j)\in E}
\bigl(
- a_{ij} f_{ij} + b_{ij}(f_{ij} - c_{ij})
\bigr)
\;+\;
\sum_{k \in V \setminus \{s,t\}}
x_k
\left(
\sum_{(i,k)\in E} f_{ik}
-
\sum_{(k,j)\in E} f_{kj}
\right)
\;\le\; 0
$$

위 식에서 $f_{ij}$의 계수를 $M_{ij}(a,b,x)$로 나타내면

$$
\sum_{(i,j)\in E}
M_{ij}(a,b,x)f_{ij}\le \sum_{(i,j)\in E}b_{ij}c_{ij}
$$

Primal objective function과 계수를 맞추면 각 $M_{ij}$는 

$$
\begin{cases}
M_{sj} = b_{sj} - a_{sj} + x_j, & M_{sj} = 1, \\
M_{it} = b_{it} - a_{it} + x_i, & M_{it} = 0, \\
M_{ij} = b_{ij} - a_{ij} + x_j - x_i, & M_{ij} = 0.
\end{cases}
$$

$a\ge 0$을 넘겨 생각하면 위 문제는 inequality constraints로 아래와 같은 dual problem으로 formulation 가능하다.

$$
\begin{aligned}
\min_{\; b \in \mathbb{R}^{|E|},\; x \in \mathbb{R}^{|V|}} \quad
& \sum_{(i,j)\in E} b_{ij} c_{ij} \\[0.5em]
\text{subject to} \quad
& b_{ij} + x_j - x_i \ge 0,
\qquad \forall (i,j)\in E, \\[0.5em]
& b \ge 0, \qquad x_s = 1,\; x_t = 0.
\end{aligned}
$$

### LP relaxation of the min cut problem

당장 위 dual problem을 보면 어떤 의미인지 파악이 쉽지 않다. 하지만 solution을

$$
x_i \in \{0, 1\} \quad \text{for all} \ \ i \in V
$$

로 제한해 가정해보자. Source를 포함한 노드들의 집합 $A=\{i:x_i = 1\}$와 sink를 포함한 노드들의 집합 $B=\{i: x_i = 0\}$이 있다고 하면 constraint
$$
b_{ij}\ge x_i -x_j \quad \text{for} \ (i, j) \in E, b\ge 0
$$
는 $i \in A$, $j \in B$라면 $b_{ij}=1$이고 나머지 상황에선 0이 되는 것을 의미한다. 따라서 해당 문제는 source를 포함한 node set에서 sink를 포함한 node set으로 지나가는 edge들의 capacity 합을 최소화 하는 것을 나타내고 이것이 바로 min cut problem이다.

$$
\begin{aligned}
\min_{\; b \in \mathbb{R}^{|E|},\; x \in \mathbb{R}^{|V|}} \quad
& \sum_{(i,j)\in E} b_{ij} c_{ij} \\[0.5em]
\text{subject to} \quad
& b_{ij} \ge x_j - x_i,
\qquad \forall (i,j)\in E, \\[0.5em]
& b_{ij},\, x_i,\, x_j \in \{0,1\},
\qquad \forall i,j.
\end{aligned}
$$

결론적으로, 우리는 min cut problem에 대해 LP relaxation을 적용한 것이 dual problem이라고 할 수 있으며 다음 관계가 성립한다.

$$
\text{value of max flow}\le \text{optimal value for LP relaxed min cut} \le \text{capacity of min cut}
$$

실제로는 **max flow min cut theorem**에 의해 부등식의 세 값을 정확히 동일함이 알려져 있다. 이처럼 dual problem과 primal problem의 optimal value가 동일한 경우 **strong duality**가 성립된다고 한다.

## Alternative perspective on LP duality

