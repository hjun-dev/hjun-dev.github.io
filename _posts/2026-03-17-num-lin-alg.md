---
layout: post
title: "[Convex Optimization] 18. Numerical Linear Algebra"
description: "실제 솔버 및 다양한 연산에서 선형대수의 수치적 분석"
date: 2026-03-17 13:00:00 +0900
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

이 포스트에서는 실제로 다양한 문제들에서 사용되는 선형대수학적 방법들을 알아보고 수치적으로 비교 및 분석한다.

---

## Complexity of basic Operations

**Flop:** Floating point operation<br>

특정 연산자들의 복잡도를 표현하기 위해서 flop이 사용된다. Flop은 주로 연산의 기본 단위로 쓰이며 다음과 같은 연산을 설명한다.

- **Addition / Subtraction of floating point numbers**
- **Multiplication / Division of floating point numbers**
<br>

Flop을 이용한 복잡도 표현은 다소 **rough**하다고 볼 수 있다. 예를 들면 특정 벡터의 공간을 할당하는 데에 쓰이는 시간 등은 고려되지 않는다. <br>
실제로도 flop counts를 정확하게 추정하는 것보다 대략적인 정도를 파악하는 것이 유용하다.
<br>

**Vector-vector operations:** $a, b \in \mathbb{R}^n$에 대해
- **Addition** ($a+b$): $n$ flops

- **Scalar multiplication** ($c \cdot a$): $n$ flops

- **Inner product** ($a^T b$): $2n$ flops ($n$번의 multiplications와 $n-1$번의 additions)

<br>

**Matrix-vector product**<br>

$A \in \mathbb{R}^{m\times n}, b \in \mathbb{R}^n$에 대해 $A$의 column vector들을 $a_i$라고 하자.<br>
Matrix-vector product는 다음과 같다.

$$
Ab = \begin{pmatrix}
a_1^{\top} b \\
\vdots \\
a_m^{\top} b
\end{pmatrix}
$$

이는 $m$개의 inner product이므로 $2mn$ flops를 가진다. 구체적으로는 다양한 matrix에 따라 아래와 같이 달라질 수 있다.

- **General matrix $A$:** $2mn$ flops

- **$s$-sparse matrix $A$:** $2s$ flops (0이 아닌 원소들만 곱하고 더하므로 $2s$의 upper bound를 가진다.)

- **$k$-banded matrix** $A\in \mathbb{R}^{n \times n}$: $2nk$ flops. (sparse matrix와 유사)

- **Low-rank matrix** $A \ (A=UV^T, U \in \mathbb{R}^{m \times r}, V \in \mathbb{R}^{n \times r})$ : $2r(m+n) = 2rm + 2rn$

$$
Ab = (UV^T)b = U(V^Tb)
$$

- **Permutation matrix** $A\in \mathbb{R}^{n\times n}$: 0 flops. (flop 관련 연산이 없으므로)

<br>

**Matrix-matrix product**<br>

$A\in \mathbb{R}^{m\times n}, B \in \mathbb{R}^{n \times p}$와 matrix product $AB$를 생각해보자.<br>
Matrix-matrix product는 **solving linear system**만큼 복잡도를 가진다. ($\mathcal{O}(n^3)$)

- **General case:** $2mnp$ flops ($p$개의 column들이 matrix-vector product)

- **$s$-sparse $A$:** $2sp$ flops (B가 sparse면 더 감소 가능)

**Matrix-matrix vector product**
<br>

$A\in \mathbb{R}^{m\times n}, B \in \mathbb{R}^{n \times p}, c\in \mathbb{R}^p$의 product $ABc$를 보자. Product를 $(AB)c$로 계산하면 전체 비용은 $2mnp + 2mp$가 된다. 하지만 $A(Bc)$로 계산하면 전체 비용은 $2np+2mn$이 된다. 따라서 보통 후자가 더 비용이 적게 든다.<br>
이러한 결과를 통해 수학적으로는 동일하더라도 cost에는 차이가 존재할 수 있다는 것을 알 수 있다.

---

## Solving linear systems

**Non-singular matrix** $A\in \mathbb{R}^{n \times n}$와 vector $b \in \mathbb{R}^n$에 대해 선형 시스템 $Ax = b$를 생각해보자. 일반적으로 $n^3$ flops가 사용된다. 중요한 것은 언제 linear system을 빠르게 풀 수 있냐는 것이다. 몇몇 특정 property를 가진 matrices는 상당히 빠르게 풀린다.

- **Diagonal $A$:** $n$ flops

$$
x = \left(\frac{b_1}{a_1} \quad \cdots \quad \frac{b_n}{a_n}\right)^T
$$

- **Lower triangular matrix** $A \ \ (A_{ij} =0, j\gt i)$: $n^2$ flops

$$
\left\{
\begin{aligned}
A_{11}x_1 &= b_1 \\
A_{21}x_1 + A_{22}x_2 &= b_2 \\
\vdots \\
A_{n1}x_1 + \cdots + A_{nn}x_n &= b_n
\end{aligned}
\right.
\;\Longrightarrow\;
\left\{
\begin{aligned}
x_1 &= \frac{b_1}{A_{11}} \\
x_2 &= \frac{b_2 - A_{21}x_1}{A_{22}} \\
\vdots \\
x_n &= \frac{b_n - A_{n,n-1}x_{n-1} - \cdots - A_{n1}x_1}{A_{nn}}
\end{aligned}
\right.
$$

이는 forward substitution이라고도 부른다. ($1+3+\cdots+(2n-1)=n^2$)

- **Upper triangular matrix $A$ (back substritution):** $n^2$ flops

- **$s$-sparse matrix $A$:** 비용은 종종 $\ll n^3$이 걸리지만 정확한 flop은 일반적인 sparse matrix에 대해 알려진 것이 없다.

- **$k$ - banded $A$:** $nk^2$ flops (증명을 위해서는 QR or Cholesky decomposition이 필요하다.)

- **Orthogonal matrix $A$:** $2n^2$ ($A^{-1}=A^T$이므로 필요한 것은 matrix-vector multiplication 뿐이다.)

- **Permutation matrix $A$:** 0. ($A^{-1}=A^T$이고 $A^T b$는 0이기 때문)

