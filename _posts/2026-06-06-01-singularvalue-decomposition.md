---
layout: post
title: "[Linear Algebra] 특이값분해의 직관적 이해"
description: "SVD를 정의역, 공역, 치역, Null Space, Row Space, Least Squares, Least Norm 관점에서 직관적으로 정리"
date: 2026-06-06 14:00:00 +0900
tags: [linear algebra, singular value decomposition, least squares]
categories: [mathematics, linear algebra]
related_posts: True
giscus_comments: true
pretty_table: true
toc:
  sidebar: left
---

## Introduction
<br>

이번 글에서는 **특이값분해(Singular Value Decomposition, SVD)**를 정리한다.

앞선 글에서 고유값분해는 실수 대칭행렬 $A$에 대해

$$
A = Q\Lambda Q^T
$$

로 쓸 수 있고, 이는 행렬이 같은 공간 안에서 고유벡터 방향들을 얼마나 늘리고 줄이는지를 보여준다고 설명했다.

하지만 고유값분해에는 중요한 제한이 있다.

고유값분해는 기본적으로 **정방행렬(square matrix)**에 대한 이야기이다.

$$
A \in \mathbb{R}^{n \times n}
$$

즉,

$$
A : \mathbb{R}^n \to \mathbb{R}^n
$$

이다.

입력공간과 출력공간이 같다.

반면 실제 문제에서는 입력 차원과 출력 차원이 다른 경우가 많다.

예를 들어,

$$
A \in \mathbb{R}^{m \times n}
$$

이면

$$
A : \mathbb{R}^n \to \mathbb{R}^m
$$

이다.

즉, $n$차원 입력공간의 벡터를 받아 $m$차원 출력공간의 벡터로 보낸다.

이때 $m$과 $n$은 다를 수 있다.

- 입력은 2차원인데 출력은 3차원일 수 있다.
- 입력은 5차원인데 출력은 2차원일 수 있다.
- 행렬이 full rank가 아닐 수도 있다.
- 어떤 입력 방향은 출력에서 완전히 사라질 수도 있다.
- 어떤 출력 방향은 애초에 만들 수 없을 수도 있다.

이런 일반적인 상황을 가장 잘 설명해주는 분해가 바로 **특이값분해**이다.

SVD의 핵심 식은 다음과 같다.

$$
A = U\Sigma V^T
$$

여기서

- $V$는 입력공간의 직교기저
- $U$는 출력공간의 직교기저
- $\Sigma$는 입력공간의 특정 방향을 출력공간의 특정 방향으로 보내면서 그 크기를 특이값만큼 스케일하는 행렬

이다.

즉, SVD는 다음 과정을 의미한다.

$$
x
\overset{V^T}{\longrightarrow}
\text{입력 특이벡터 좌표계}
\overset{\Sigma}{\longrightarrow}
\text{특이값만큼 스케일 및 차원 변환}
\overset{U}{\longrightarrow}
\text{출력공간}
$$

고유값분해가 같은 공간 안에서의 “고유방향별 스케일링”이라면, SVD는 입력공간과 출력공간을 연결하는 “입력방향과 출력방향 사이의 스케일링”이다.

---

## 1. 행렬을 함수처럼 보기
<br>

행렬 $A \in \mathbb{R}^{m \times n}$은 다음과 같은 선형변환이다.

$$
A : \mathbb{R}^n \to \mathbb{R}^m
$$

즉, 입력벡터 $x \in \mathbb{R}^n$을 받아 출력벡터 $Ax \in \mathbb{R}^m$를 만든다.

여기서 용어를 정리하자.

| 용어 | 의미 |
| --- | --- |
| 정의역(domain) | 입력공간 $\mathbb{R}^n$ |
| 공역(codomain) | 출력이 속한다고 정해둔 전체 공간 $\mathbb{R}^m$ |
| 치역(range, image) | 실제로 $Ax$ 형태로 만들 수 있는 출력들의 집합 |
| 영공간(null space) | $Ax=0$이 되는 입력들의 집합 |

수식으로 쓰면

$$
\mathcal{N}(A)
=
\{x \in \mathbb{R}^n \mid Ax = 0\}
$$

이고,

$$
\mathcal{R}(A)
=
\{Ax \in \mathbb{R}^m \mid x \in \mathbb{R}^n\}
$$

이다.

중요한 점은 **공역과 치역이 다를 수 있다**는 것이다.

예를 들어

$$
A : \mathbb{R}^2 \to \mathbb{R}^3
$$

이면 출력은 3차원 공간에 놓이지만, 실제로 만들 수 있는 출력들은 보통 3차원 전체가 아니라 그 안의 2차원 평면일 수 있다.

이때

$$
\mathcal{R}(A) \subseteq \mathbb{R}^3
$$

이다.

즉, 공역은 $\mathbb{R}^3$이지만 치역은 그 안의 부분공간이다.

이 관점을 그림으로 보면 다음과 같다. 예를 들어 $A \in \mathbb{R}^{3 \times 2}$이면 입력공간은 $\mathbb{R}^2$이고 출력공간은 $\mathbb{R}^3$이다. 이때 $A$는 입력공간의 방향들을 출력공간 안의 실제로 만들 수 있는 부분공간, 즉 Range $\mathcal{R}(A)$로 보낸다.


<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-9 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/svd_domain_to_range.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    A matrix can map an input space into a lower-dimensional range inside the output space.
</div>
<br>

---

## 2. 고유값분해와 SVD의 차이
<br>

고유값분해는 보통 정방행렬에서 출발한다.

$$
A \in \mathbb{R}^{n \times n}
$$

따라서

$$
A : \mathbb{R}^n \to \mathbb{R}^n
$$

이다.

입력공간과 출력공간이 같기 때문에, 어떤 벡터 $v$에 대해

$$
Av = \lambda v
$$

라고 말할 수 있다.

즉, 입력벡터 $v$와 출력벡터 $Av$가 같은 공간에 있으므로 “방향이 유지된다”는 표현이 가능하다.

하지만

$$
A \in \mathbb{R}^{m \times n}
$$

이고 $m \neq n$이면 이야기가 달라진다.

$$
A : \mathbb{R}^n \to \mathbb{R}^m
$$

이므로 입력벡터 $x$는 $\mathbb{R}^n$에 있고, 출력벡터 $Ax$는 $\mathbb{R}^m$에 있다.

입력공간과 출력공간 자체가 다르다.

따라서 일반적으로

$$
Ax = \lambda x
$$

라고 말할 수 없다.

왼쪽 $Ax$는 $\mathbb{R}^m$의 벡터이고, 오른쪽 $x$는 $\mathbb{R}^n$의 벡터이기 때문이다.

그래서 SVD는 다른 방식으로 묻는다.

> 입력공간의 어떤 직교방향 $v_i$가 출력공간의 어떤 직교방향 $u_i$로 가는가? 그리고 그때 얼마나 스케일되는가?

이 질문에 대한 답이

$$
Av_i = \sigma_i u_i
$$

이다.

여기서

- $v_i$ : 입력공간의 오른쪽 특이벡터(right singular vector)
- $u_i$ : 출력공간의 왼쪽 특이벡터(left singular vector)
- $\sigma_i$ : 특이값(singular value)

이다.

고유값분해가

$$
Av_i = \lambda_i v_i
$$

였다면, SVD는

$$
Av_i = \sigma_i u_i
$$

이다.

즉, 고유값분해에서는 입력방향과 출력방향이 같은 벡터 $v_i$였지만, SVD에서는 입력방향 $v_i$와 출력방향 $u_i$가 서로 다른 공간에 존재한다.

---

## 3. 왜 특이값은 음수가 아닌가?
<br>

고유값은 음수가 될 수 있다.

예를 들어 대칭행렬에서

$$
Av = \lambda v
$$

이고 $\lambda < 0$이면, 이는 $v$ 방향 성분이 반대 방향으로 뒤집히며 $\vert\lambda\vert$배 스케일된다는 뜻이다.

즉, 고유값분해에서는 입력공간과 출력공간이 같기 때문에 “같은 방향으로 가는지, 반대 방향으로 뒤집히는지”를 고유값의 부호로 표현할 수 있다.

하지만 SVD는 관점이 다르다.

SVD에서는

$$
Av_i = \sigma_i u_i
$$

로 쓴다.

여기서 $v_i$는 입력공간의 방향이고, $u_i$는 출력공간의 방향이다.

즉, 출력방향 $u_i$ 자체를 따로 정한다.

만약 어떤 변환에서 부호가 뒤집히는 효과가 있다면, 그 부호는 특이값 $\sigma_i$에 넣는 것이 아니라 출력 특이벡터 $u_i$의 방향 선택에 흡수할 수 있다.

예를 들어

$$
Av_i = -3u_i
$$

라고 나타날 수 있는 상황이 있다면, 출력 특이벡터를

$$
\tilde{u}_i = -u_i
$$

로 다시 잡으면

$$
Av_i = 3\tilde{u}_i
$$

라고 쓸 수 있다.

따라서 SVD에서는 스케일링의 크기만 특이값으로 두고, 방향의 부호는 $u_i$ 또는 $v_i$의 방향 선택에 포함시킨다.

그래서 특이값은 항상 0 이상이다.

$$
\sigma_i \ge 0
$$

그리고 reduced SVD에서 실제로 사용하는 유효한 특이값들은 양수이다.

$$
\sigma_i > 0
\quad
(i=1,\dots,r)
$$

정리하면 다음과 같다.

| 분해 | 기본 식 | 부호 해석 |
| --- | --- | --- |
| 고유값분해 | $Av_i = \lambda_i v_i$ | 같은 공간에서 방향 유지 또는 반전까지 $\lambda_i$의 부호로 표현 |
| 특이값분해 | $Av_i = \sigma_i u_i$ | 입력방향과 출력방향을 따로 정하므로 스케일 크기 $\sigma_i$는 항상 0 이상 |

즉, 고유값은 방향 반전까지 포함한 값이고, 특이값은 순수한 스케일링 크기이다.

---

## 4. SVD의 기본 형태
<br>

임의의 행렬

$$
A \in \mathbb{R}^{m \times n}
$$

에 대해 SVD는 다음과 같이 쓸 수 있다.

$$
A = U\Sigma V^T
$$

여기서

$$
U \in \mathbb{R}^{m \times m}
$$

$$
\Sigma \in \mathbb{R}^{m \times n}
$$

$$
V \in \mathbb{R}^{n \times n}
$$

이다.

각 행렬의 의미는 다음과 같다.

| 기호 | 크기 | 의미 |
| --- | --- | --- |
| $V$ | $n \times n$ | 입력공간 $\mathbb{R}^n$의 정규직교기저 |
| $\Sigma$ | $m \times n$ | 입력 방향을 출력 방향으로 보내며 특이값만큼 스케일 |
| $U$ | $m \times m$ | 출력공간 $\mathbb{R}^m$의 정규직교기저 |

$U$와 $V$는 직교행렬이다.

$$
U^TU = UU^T = I
$$

$$
V^TV = VV^T = I
$$

$\Sigma$는 대각선 모양의 직사각행렬이다.

예를 들어 $m=3$, $n=2$이면

$$
\Sigma =
\begin{bmatrix}
\sigma_1 & 0 \\
0 & \sigma_2 \\
0 & 0
\end{bmatrix}
$$

이고, $m=2$, $n=3$이면

$$
\Sigma =
\begin{bmatrix}
\sigma_1 & 0 & 0 \\
0 & \sigma_2 & 0
\end{bmatrix}
$$

이다.

특이값은 항상 0 이상이다.

$$
\sigma_i \ge 0
$$

보통 큰 값부터 정렬한다.

$$
\sigma_1 \ge \sigma_2 \ge \cdots \ge 0
$$

---

## 5. $A = U\Sigma V^T$의 작용
<br>

SVD의 의미를 벡터 $x$에 적용해서 보자.

$$
Ax = U\Sigma V^T x
$$

이 식도 오른쪽부터 읽는다.

---

### 5.1 첫 번째 단계: $V^Tx$
<br>

$V$의 열벡터들을

$$
v_1, v_2, \dots, v_n
$$

이라고 하자.

이들은 입력공간 $\mathbb{R}^n$의 정규직교기저이다.

따라서

$$
V^Tx =
\begin{bmatrix}
v_1^Tx \\
v_2^Tx \\
\vdots \\
v_n^Tx
\end{bmatrix}
$$

이다.

즉, 입력벡터 $x$를 입력공간의 특이벡터 방향들로 분해한다.

$$
x =
c_1v_1 + c_2v_2 + \cdots + c_nv_n
$$

여기서

$$
c_i = v_i^Tx
$$

이다.

---

### 5.2 두 번째 단계: $\Sigma V^Tx$
<br>

이제 $\Sigma$가 각 입력 특이벡터 방향 성분을 특이값만큼 스케일한다.

rank가 $r$이면 양의 특이값은

$$
\sigma_1, \sigma_2, \dots, \sigma_r
$$

이고,

$$
\sigma_{r+1} = \cdots = 0
$$

이다.

따라서 $\Sigma V^Tx$는 입력 성분 중 유효한 $r$개 방향만 남기고, 각 성분을 특이값만큼 스케일한다.

---

### 5.3 세 번째 단계: $U\Sigma V^Tx$
<br>

마지막으로 $U$를 곱한다.

이는 스케일된 성분들을 출력공간의 특이벡터 방향으로 합치는 과정이다.

결과적으로

$$
Ax =
\sum_{i=1}^{r}
\sigma_i (v_i^Tx) u_i
$$

이다.

이 식이 SVD의 핵심이다.

> 입력벡터를 입력 특이벡터 방향들로 분해하고, 유효한 방향들을 특이값만큼 스케일한 뒤, 출력 특이벡터 방향들로 다시 합친다.

즉, SVD는 입력공간의 직교방향 $v_i$를 출력공간의 직교방향 $u_i$로 보내는 구조이다.

$$
Av_i = \sigma_i u_i
$$

이 흐름을 한 장의 그림으로 정리하면 다음과 같다. 먼저 $V^T$는 입력벡터 $x$를 오른쪽 특이벡터 좌표계에서 본다. 그다음 $\Sigma$는 각 좌표 성분을 특이값만큼 스케일한다. 마지막으로 $U$는 스케일된 성분을 출력공간의 왼쪽 특이벡터 방향으로 합친다.


<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-9 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/svd_three_step_geometry.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    SVD as input coordinate change, singular-value scaling, and output coordinate change.
</div>
<br>

---

## 6. Reduced SVD
<br>

Full SVD는 다음과 같다.

$$
A = U\Sigma V^T
$$

여기서 $U$는 $m \times m$, $V$는 $n \times n$이다.

하지만 실제로 $A$의 작용에 필요한 것은 양의 특이값에 대응하는 부분뿐이다.

rank가 $r$이면 reduced SVD는 다음과 같다.

$$
A =
U_r \Sigma_r V_r^T
$$

여기서

$$
U_r \in \mathbb{R}^{m \times r}
$$

$$
\Sigma_r \in \mathbb{R}^{r \times r}
$$

$$
V_r \in \mathbb{R}^{n \times r}
$$

이다.

그리고

$$
\Sigma_r =
\begin{bmatrix}
\sigma_1 & & 0 \\
& \ddots & \\
0 & & \sigma_r
\end{bmatrix}
$$

이다.

Reduced SVD에서는

$$
\sigma_1,\dots,\sigma_r > 0
$$

인 유효 특이값만 남긴다.

즉,

- $V_r$ : Null Space로 사라지지 않는 입력 방향들
- $U_r$ : 실제 Range를 이루는 출력 방향들
- $\Sigma_r$ : 그 사이의 양의 스케일링

이다.

따라서 SVD를 해석할 때는 full SVD보다 reduced SVD가 더 직관적인 경우가 많다.

---

## 7. SVD와 $A^TA$, $AA^T$
<br>

SVD는 $A^TA$와 $AA^T$의 고유값분해와 깊게 연결되어 있다.

먼저

$$
A = U\Sigma V^T
$$

라고 하자.

그러면

$$
A^TA
=
(V\Sigma^TU^T)(U\Sigma V^T)
=
V\Sigma^T\Sigma V^T
$$

이다.

즉,

$$
A^TA = V(\Sigma^T\Sigma)V^T
$$

이다.

따라서 $V$는 $A^TA$의 고유벡터 행렬이고, 고유값은 특이값의 제곱이다.

$$
A^TAv_i = \sigma_i^2 v_i
$$

마찬가지로

$$
AA^T
=
(U\Sigma V^T)(V\Sigma^TU^T)
=
U\Sigma\Sigma^TU^T
$$

이다.

따라서 $U$는 $AA^T$의 고유벡터 행렬이고, 고유값은 역시 특이값의 제곱이다.

$$
AA^T u_i = \sigma_i^2 u_i
$$

정리하면 다음과 같다.

| 대상 | 고유벡터 | 고유값 |
| --- | --- | --- |
| $A^TA$ | 오른쪽 특이벡터 $v_i$ | $\sigma_i^2$ |
| $AA^T$ | 왼쪽 특이벡터 $u_i$ | $\sigma_i^2$ |

여기서도 특이값이 왜 음수가 아닌지 볼 수 있다.

$A^TA$와 $AA^T$는 모두 positive semidefinite 행렬이다. 따라서 고유값은 0 이상이고, 그 고유값이 $\sigma_i^2$이다.

즉,

$$
\sigma_i = \sqrt{\lambda_i(A^TA)} \ge 0
$$

이다.

SVD는 비정방행렬 $A$ 자체를 직접 대각화하는 대신, 입력공간 쪽의 $A^TA$와 출력공간 쪽의 $AA^T$를 이용해 양쪽 직교기저를 찾는 과정이라고 볼 수 있다.

---

## 8. Null Space, Row Space, Range, Left Null Space
<br>

SVD의 가장 좋은 점은 네 가지 기본 부분공간을 한 번에 보여준다는 것이다.

행렬

$$
A \in \mathbb{R}^{m \times n}
$$

에 대해 네 가지 공간이 있다.

| 공간 | 위치 | 정의 |
| --- | --- | --- |
| Null Space | 입력공간 $\mathbb{R}^n$ | $Ax=0$이 되는 입력 |
| Row Space | 입력공간 $\mathbb{R}^n$ | $A$의 row들이 span하는 공간, 즉 $\mathcal{R}(A^T)$ |
| Range / Column Space | 출력공간 $\mathbb{R}^m$ | $Ax$로 만들 수 있는 출력 |
| Left Null Space | 출력공간 $\mathbb{R}^m$ | $A^Ty=0$이 되는 출력공간 방향 |

SVD로 보면 이 공간들이 매우 명확해진다.

rank가 $r$이면

$$
A =
\sum_{i=1}^{r}
\sigma_i u_i v_i^T
$$

이다.

이때

$$
\sigma_1,\dots,\sigma_r > 0
$$

이고, 나머지 특이값은 0이다.

입력공간의 오른쪽 특이벡터들은

$$
v_1,\dots,v_r,\ v_{r+1},\dots,v_n
$$

으로 나뉜다.

출력공간의 왼쪽 특이벡터들은

$$
u_1,\dots,u_r,\ u_{r+1},\dots,u_m
$$

으로 나뉜다.

각 공간은 다음과 같다.

$$
\mathcal{R}(A^T)
=
\text{span}\{v_1,\dots,v_r\}
$$

$$
\mathcal{N}(A)
=
\text{span}\{v_{r+1},\dots,v_n\}
$$

$$
\mathcal{R}(A)
=
\text{span}\{u_1,\dots,u_r\}
$$

$$
\mathcal{N}(A^T)
=
\text{span}\{u_{r+1},\dots,u_m\}
$$

즉,

- 입력공간은 Row Space와 Null Space로 나뉜다.
- 출력공간은 Range와 Left Null Space로 나뉜다.

$$
\mathbb{R}^n
=
\mathcal{R}(A^T)
\oplus
\mathcal{N}(A)
$$

$$
\mathbb{R}^m
=
\mathcal{R}(A)
\oplus
\mathcal{N}(A^T)
$$

여기서 $\oplus$는 서로 직교하는 부분공간의 direct sum이라는 의미이다.

---

## 9. Rank-Nullity Theorem을 SVD로 보기
<br>

입력공간 쪽에서 가장 유명한 관계가 있다.

$$
\text{rank}(A) + \text{nullity}(A) = n
$$

이를 **Rank-Nullity Theorem**이라고 한다.

SVD 관점에서는 이 정리가 매우 직관적이다.

rank가 $r$이라는 것은 양의 특이값이 $r$개라는 뜻이다.

$$
\sigma_1,\dots,\sigma_r > 0
$$

그리고 나머지 방향은 특이값 0에 대응한다.

입력공간의 오른쪽 특이벡터 $v_i$들은 전체 $\mathbb{R}^n$의 직교기저를 이룬다.

그중

$$
v_1,\dots,v_r
$$

은 양의 특이값에 대응하므로 출력으로 살아남는다. 이들은 Row Space를 이룬다.

$$
\mathcal{R}(A^T)
=
\text{span}\{v_1,\dots,v_r\}
$$

반면

$$
v_{r+1},\dots,v_n
$$

은 특이값 0에 대응하므로 $A$를 곱하면 사라진다.

$$
Av_i = 0
\quad
(i>r)
$$

이들은 Null Space를 이룬다.

$$
\mathcal{N}(A)
=
\text{span}\{v_{r+1},\dots,v_n\}
$$

따라서

$$
\dim \mathcal{R}(A^T) = r
$$

이고,

$$
\dim \mathcal{N}(A) = n-r
$$

이다.

결국

$$
\dim \mathcal{R}(A^T)
+
\dim \mathcal{N}(A)
=
r + (n-r)
=
n
$$

이다.

즉,

$$
\text{rank}(A) + \text{nullity}(A) = n
$$

이다.

이것을 말로 쓰면 다음과 같다.

> 입력공간의 방향들 중 유효한 특이값을 가진 방향은 Row Space가 되고, 특이값이 0인 방향은 Null Space가 된다. 둘을 합치면 전체 입력공간이다.

이것이 SVD로 보는 Rank-Nullity Theorem이다.

---

## 10. 출력공간 쪽의 차원 관계
<br>

출력공간에서도 비슷한 관계가 있다.

출력공간 $\mathbb{R}^m$은 Range와 Left Null Space로 나뉜다.

$$
\mathbb{R}^m
=
\mathcal{R}(A)
\oplus
\mathcal{N}(A^T)
$$

rank가 $r$이면

$$
\mathcal{R}(A)
=
\text{span}\{u_1,\dots,u_r\}
$$

이고,

$$
\mathcal{N}(A^T)
=
\text{span}\{u_{r+1},\dots,u_m\}
$$

이다.

따라서

$$
\dim \mathcal{R}(A) = r
$$

이고,

$$
\dim \mathcal{N}(A^T) = m-r
$$

이다.

결국

$$
\dim \mathcal{R}(A)
+
\dim \mathcal{N}(A^T)
=
m
$$

이다.

즉,

$$
\text{rank}(A) + \text{nullity}(A^T) = m
$$

이다.

입력공간에서는 Row Space와 Null Space가 전체를 나누고, 출력공간에서는 Range와 Left Null Space가 전체를 나눈다.

---

## 11. Tall matrix: 식이 많은 경우
<br>

이제 입력 차원과 출력 차원이 다른 경우를 보자.

먼저 tall matrix를 생각하자.

$$
A \in \mathbb{R}^{m \times n},
\quad
m > n
$$

예를 들어

$$
A : \mathbb{R}^2 \to \mathbb{R}^3
$$

이다.

입력은 2차원이고 출력은 3차원이다.

이 경우 $A$는 2차원 입력공간을 3차원 출력공간 안의 어떤 부분공간으로 보낸다.

만약 full column rank이면 rank는 $n$이다.

$$
r = n
$$

예를 들어 $m=3$, $n=2$이면 rank는 최대 2이다.

즉, 3차원 출력공간 전체를 만들 수는 없다. 만들 수 있는 출력은 3차원 공간 안의 2차원 평면이다.

$$
\mathcal{R}(A)
\subset
\mathbb{R}^3
$$

이때 어떤 $b \in \mathbb{R}^3$에 대해

$$
Ax = b
$$

를 풀고 싶다고 하자.

$b$가 Range 안에 있으면 해가 존재한다.

$$
b \in \mathcal{R}(A)
$$

하지만 일반적인 $b$는 Range 밖에 있을 가능성이 높다.

그러면 정확히

$$
Ax = b
$$

를 만족하는 해는 존재하지 않는다.

이때 사용하는 것이 least squares이다.

$$
\min_x \|Ax-b\|_2
$$

즉, $b$를 정확히 맞출 수는 없으니, $Ax$가 $b$에 가장 가까워지도록 하는 입력 $x$를 찾는다.

SVD 관점에서는 이것이 매우 명확하다.

$b$를 출력공간의 $U$ 기저로 분해한다.

$$
b =
\underbrace{b_{\mathcal{R}}}_{\text{Range 성분}}
+
\underbrace{b_{\mathcal{N}(A^T)}}_{\text{Left Null Space 성분}}
$$

Range 성분은 $Ax$로 만들 수 있다. 하지만 Left Null Space 성분은 어떤 $x$를 넣어도 만들 수 없다.

따라서 least squares는 사실상 $b$를 Range 위로 직교 projection한 뒤,

$$
Ax \approx \text{proj}_{\mathcal{R}(A)} b
$$

를 만족하는 $x$를 찾는 문제이다.

---

## 12. Wide matrix: 미지수가 많은 경우
<br>

이번에는 wide matrix를 보자.

$$
A \in \mathbb{R}^{m \times n},
\quad
m < n
$$

예를 들어

$$
A : \mathbb{R}^3 \to \mathbb{R}^2
$$

이다.

입력은 3차원이고 출력은 2차원이다.

이 경우 입력공간이 더 크기 때문에, 어떤 입력 방향들은 출력에 영향을 주지 않을 수 있다.

즉, Null Space가 생긴다.

만약 full row rank이면 rank는 $m$이다.

$$
r = m
$$

예를 들어 $m=2$, $n=3$이면 rank는 최대 2이다.

따라서 Null Space의 차원은

$$
n-r = 3-2 = 1
$$

이다.

즉, 입력공간 3차원 중 2차원 방향은 출력에 영향을 주고, 나머지 1차원 방향은 출력에서 사라진다.

이때 어떤 $b \in \mathbb{R}^2$에 대해

$$
Ax = b
$$

를 풀고 싶다고 하자.

full row rank이면 대부분의 $b \in \mathbb{R}^2$에 대해 해가 존재한다. 하지만 해는 하나가 아니라 무한히 많다.

왜냐하면 어떤 해 $x_p$가 하나 있으면, Null Space의 임의의 벡터 $z \in \mathcal{N}(A)$에 대해

$$
A(x_p + z)
=
Ax_p + Az
=
b + 0
=
b
$$

이기 때문이다.

따라서 모든 해는

$$
x = x_p + z,
\quad
z \in \mathcal{N}(A)
$$

형태이다.

이때 자주 찾는 해가 **least norm solution**이다.

$$
\min_x \|x\|_2
\quad
\text{subject to}
\quad
Ax=b
$$

즉, $Ax=b$를 만족하는 해들 중에서 가장 norm이 작은 해를 고른다.

SVD 관점에서는 이 해가 Null Space 성분을 갖지 않는 해이다.

왜냐하면 Null Space 성분은 출력에는 영향을 주지 않지만 입력 norm만 증가시키기 때문이다.

따라서 least norm solution은 Row Space 안에 있는 해이다.

$$
x_{\text{LN}}
\in
\mathcal{R}(A^T)
$$

---

## 13. Full rank가 아닌 경우
<br>

행렬이 full rank가 아니면 특이값 중 일부가 0이 된다.

예를 들어

$$
A \in \mathbb{R}^{3 \times 2}
$$

인데 rank가 1이라고 하자.

그러면 입력은 2차원이지만 실제로 출력에 영향을 주는 입력 방향은 1개뿐이다.

SVD로 쓰면

$$
A =
\sigma_1 u_1 v_1^T
$$

이다.

즉,

$$
Ax =
\sigma_1 (v_1^Tx) u_1
$$

이다.

입력벡터 $x$를

$$
x = c_1v_1 + c_2v_2
$$

라고 쓰면,

$$
Ax =
\sigma_1 c_1 u_1
$$

이다.

$c_2v_2$ 성분은 완전히 사라진다.

즉,

$$
v_2 \in \mathcal{N}(A)
$$

이다.

출력 쪽에서도 실제로 만들 수 있는 방향은 $u_1$ 방향뿐이다.

$$
\mathcal{R}(A)
=
\text{span}\{u_1\}
$$

따라서 출력공간이 3차원이어도 실제 출력은 그 안의 1차원 직선 위에만 존재한다.

이런 식으로 SVD는 rank-deficient 행렬이 어떤 방향을 잃어버리는지, 어떤 출력 방향만 만들 수 있는지를 아주 명확하게 보여준다.

---

## 14. Least Squares를 SVD로 이해하기
<br>

Least squares 문제는 다음과 같다.

$$
\min_x \|Ax-b\|_2
$$

이 문제는 보통 식이 많은 경우, 즉 tall matrix에서 많이 등장한다.

$$
A \in \mathbb{R}^{m \times n},
\quad
m > n
$$

예를 들어 2차원 입력 $x$로 3차원 출력 $b$를 맞추려는 경우를 생각하자.

$$
A : \mathbb{R}^2 \to \mathbb{R}^3
$$

출력공간은 3차원이지만, $Ax$가 만들 수 있는 출력들은 보통 그 안의 2차원 평면이다.

따라서 임의의 $b \in \mathbb{R}^3$는 그 평면 위에 있지 않을 수 있다.

이 경우

$$
Ax = b
$$

를 정확히 만족하는 $x$는 존재하지 않는다.

그래서 $b$와 가장 가까운 Range 위의 점을 찾는다.

$$
\min_x \|Ax-b\|_2
$$

SVD로 보면 $b$를 출력공간의 $U$ 기저로 분해할 수 있다.

$$
b
=
\sum_{i=1}^{m}
\beta_i u_i
$$

여기서

$$
\beta_i = u_i^Tb
$$

이다.

rank가 $r$이면 Range는

$$
\mathcal{R}(A)
=
\text{span}\{u_1,\dots,u_r\}
$$

이다.

따라서 $b$ 중에서 $Ax$로 만들 수 있는 성분은

$$
\sum_{i=1}^{r}\beta_i u_i
$$

뿐이다.

나머지

$$
\sum_{i=r+1}^{m}\beta_i u_i
$$

는 Left Null Space 성분이므로 어떤 $x$로도 만들 수 없다.

따라서 least squares는 $b$를 Range 위로 projection한

$$
b_{\mathcal{R}}
=
\sum_{i=1}^{r}\beta_i u_i
$$

를 맞추는 문제이다.

즉,

$$
Ax_{\text{LS}}
=
\text{proj}_{\mathcal{R}(A)} b
$$

가 된다.

즉, least squares의 핵심은 $b$를 억지로 맞추는 것이 아니라, $A$가 실제로 만들 수 있는 공간 $\mathcal{R}(A)$ 안에서 $b$와 가장 가까운 점을 찾는 것이다. 이때 남는 오차 $b - Ax_{\text{LS}}$는 Range에 수직인 Left Null Space 방향에 놓인다.


<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-9 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/svd_least_squares_projection.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    Least squares chooses the point in the range of A closest to b.
</div>
<br>

Reduced SVD

$$
A = U_r\Sigma_r V_r^T
$$

를 쓰면 least squares 해는

$$
x_{\text{LS}}
=
V_r\Sigma_r^{-1}U_r^Tb
$$

이다.

여기서

$$
\Sigma_r^{-1}
=
\begin{bmatrix}
1/\sigma_1 & & 0 \\
& \ddots & \\
0 & & 1/\sigma_r
\end{bmatrix}
$$

이다.

이 식은 다음 의미를 가진다.

1. $U_r^Tb$
   - 출력벡터 $b$를 Range 방향 성분으로 본다.

2. $\Sigma_r^{-1}U_r^Tb$
   - 각 출력방향 성분을 특이값으로 나누어 입력방향 성분으로 되돌린다.

3. $V_r\Sigma_r^{-1}U_r^Tb$
   - 입력공간의 Row Space 방향으로 다시 합친다.

즉, least squares 해는 출력공간의 $b$를 Range에 projection한 뒤, 그 Range 성분을 입력공간으로 되돌린 결과이다.

---

## 15. Least Norm Solution을 SVD로 이해하기
<br>

Least norm 문제는 보통 미지수가 많은 경우에 등장한다.

$$
A \in \mathbb{R}^{m \times n},
\quad
m < n
$$

예를 들어

$$
A : \mathbb{R}^3 \to \mathbb{R}^2
$$

라고 하자.

입력공간이 더 크기 때문에, 같은 출력 $b$를 만드는 입력 $x$가 여러 개 있을 수 있다.

문제는 다음과 같다.

$$
\min_x \|x\|_2
\quad
\text{subject to}
\quad
Ax=b
$$

어떤 특정해 $x_p$가 있으면 모든 해는

$$
x = x_p + z,
\quad
z \in \mathcal{N}(A)
$$

이다.

여기서 $z$는 Null Space 성분이다.

Null Space 성분은 출력에 영향을 주지 않는다.

$$
Az=0
$$

하지만 입력 norm은 증가시킨다.

따라서 norm이 가장 작은 해는 Null Space 성분을 가지지 않는 해이다.

즉,

$$
x_{\text{LN}}
\in
\mathcal{R}(A^T)
$$

이다.

기하학적으로 보면 해집합은 Null Space 방향으로 뻗은 affine subspace이다. 이 해집합 위의 점들은 모두 같은 $b$를 만들지만, 원점에서 가장 가까운 점만이 Null Space 성분을 갖지 않는다. 그 점이 least norm solution이다.


<div class="row mt-3 justify-content-sm-center">
    <div class="col-sm-9 mt-3 mt-md-0">
        {% include figure.liquid 
            loading="eager" 
            path="assets/img/blog_img/svd_least_norm_solution.png" 
            class="img-fluid rounded z-depth-1" 
            zoomable=true 
        %}
    </div>
</div>

<div class="caption">
    When Ax=b has infinitely many solutions, the least norm solution is the one closest to the origin.
</div>
<br>

SVD로 보면 해는 다음과 같다.

$$
x_{\text{LN}}
=
V_r\Sigma_r^{-1}U_r^Tb
$$

형태이다.

이 식은 least squares와 같은 모양을 가진다. 실제로 이 식은 Moore-Penrose pseudoinverse로 쓴 해이다.

$$
x^\star = A^+b
$$

여기서

$$
A^+
=
V_r\Sigma_r^{-1}U_r^T
$$

이다.

즉, pseudoinverse는 SVD를 거꾸로 따라가는 연산이다.

$$
A = U_r\Sigma_r V_r^T
$$

라면,

$$
A^+ = V_r\Sigma_r^{-1}U_r^T
$$

이다.

말로 표현하면 다음과 같다.

> 출력공간의 벡터를 Range 방향으로 분해하고, 특이값으로 나누어 입력공간의 유효한 방향으로 되돌린다.

---

## 16. Pseudoinverse의 직관
<br>

정방행렬 $A$가 invertible이면

$$
x = A^{-1}b
$$

로 해를 구할 수 있다.

하지만 $A$가 직사각행렬이거나 rank-deficient이면 일반적인 역행렬은 존재하지 않는다.

이때 SVD를 이용해 “가능한 범위에서의 역연산”을 정의한다.

SVD가

$$
A = U_r\Sigma_r V_r^T
$$

라면 pseudoinverse는

$$
A^+ = V_r\Sigma_r^{-1}U_r^T
$$

이다.

이것은 $A$의 작용을 반대로 따라가는 것이다.

$A$의 작용은 다음과 같았다.

$$
x
\overset{V_r^T}{\longrightarrow}
\text{입력 유효좌표}
\overset{\Sigma_r}{\longrightarrow}
\text{특이값만큼 스케일}
\overset{U_r}{\longrightarrow}
\text{출력 Range}
$$

반대로 pseudoinverse는

$$
b
\overset{U_r^T}{\longrightarrow}
\text{출력 Range 좌표}
\overset{\Sigma_r^{-1}}{\longrightarrow}
\text{특이값으로 나누기}
\overset{V_r}{\longrightarrow}
\text{입력 Row Space}
$$

이다.

따라서

$$
A^+b
$$

는 다음을 수행한다.

1. $b$ 중에서 $A$가 만들 수 있는 Range 성분만 본다.
2. 그 성분을 특이값으로 나누어 입력 방향 성분으로 되돌린다.
3. Null Space 성분은 넣지 않는다.

그래서 pseudoinverse 해는 상황에 따라 다음 의미를 가진다.

| 상황 | $A^+b$의 의미 |
| --- | --- |
| 해가 없을 때 | least squares 해 |
| 해가 무한히 많을 때 | least norm 해 |
| 해가 유일할 때 | 일반적인 역행렬 해와 동일 |
| rank-deficient일 때 | 만들 수 있는 성분만 가장 자연스럽게 되돌린 해 |

---

## 17. Tall, Wide, Rank-deficient 상황 정리
<br>

SVD 관점에서 행렬의 종류를 정리하면 다음과 같다.

| 행렬 형태 | 예시 | rank 조건 | 해석 |
| --- | --- | --- | --- |
| Tall full column rank | $m>n$, $r=n$ | Null Space 없음 | 입력의 모든 방향이 출력에 반영되지만, 출력공간 전체를 만들지는 못함 |
| Wide full row rank | $m<n$, $r=m$ | Left Null Space 없음 | 출력공간 전체를 만들 수 있지만, 같은 출력을 만드는 입력이 무한히 많음 |
| Rank-deficient tall | $m>n$, $r<n$ | Null Space 존재 | 입력 중 일부 방향이 사라지고, 출력도 제한된 부분공간에만 존재 |
| Rank-deficient wide | $m<n$, $r<m$ | Null Space와 Left Null Space 모두 존재 | 입력 중 사라지는 방향도 있고, 출력 중 만들 수 없는 방향도 있음 |
| Square full rank | $m=n=r$ | 역행렬 존재 | 모든 입력 방향이 살아남고 출력공간 전체를 만듦 |
| Square rank-deficient | $m=n$, $r<n$ | 역행렬 없음 | 일부 방향이 사라지고 일부 출력 방향은 만들 수 없음 |

이 표를 SVD로 보면 다음 한 문장으로 정리된다.

> rank $r$은 살아남는 특이방향의 개수이고, 나머지 방향은 입력 쪽에서는 Null Space, 출력 쪽에서는 Left Null Space를 만든다.

---

## 18. 2-norm과 Condition Number
<br>

SVD는 행렬의 norm과 condition number도 직관적으로 설명한다.

행렬의 2-norm은

$$
\|A\|_2
=
\max_{x \neq 0}
\frac{\|Ax\|_2}{\|x\|_2}
$$

이다.

SVD 관점에서는 가장 큰 특이값이 행렬의 최대 스케일링이다.

$$
\|A\|_2 = \sigma_1
$$

즉, 입력 특이벡터 $v_1$ 방향으로 넣었을 때 출력은 가장 크게 늘어난다.

$$
Av_1 = \sigma_1 u_1
$$

반대로 가장 작은 양의 특이값은 행렬이 가장 약하게 반응하는 유효 방향을 나타낸다.

Condition number는 다음과 같다.

$$
\kappa(A)
=
\frac{\sigma_{\max}}{\sigma_{\min}}
$$

full rank 행렬에서 $\sigma_{\min}$이 매우 작으면, 어떤 입력 방향은 출력에서 거의 사라진다는 뜻이다.

이 경우 역문제에서 문제가 생긴다.

왜냐하면 pseudoinverse에서는 특이값으로 나누기 때문이다.

$$
\frac{1}{\sigma_i}
$$

작은 특이값에 대응하는 성분은 역으로 되돌릴 때 매우 크게 증폭된다.

따라서 작은 noise가 큰 오차로 증폭될 수 있다.

이것이 ill-conditioned matrix의 핵심 직관이다.

---

## 19. Low-rank approximation
<br>

SVD의 또 다른 중요한 응용은 low-rank approximation이다.

SVD는

$$
A =
\sum_{i=1}^{r}
\sigma_i u_i v_i^T
$$

로 쓸 수 있다.

특이값이 큰 순서대로 정렬되어 있으므로, 앞의 $k$개만 남기면 rank-$k$ approximation을 얻는다.

$$
A_k =
\sum_{i=1}^{k}
\sigma_i u_i v_i^T
$$

이는 행렬 $A$의 중요한 작용만 남기고 작은 특이값에 해당하는 약한 방향들은 제거한 것이다.

직관적으로는 다음과 같다.

- 큰 특이값 방향 : 행렬의 주요 구조
- 작은 특이값 방향 : 세부 구조 또는 noise일 가능성이 큼
- 0인 특이값 방향 : 완전히 사라지는 방향

따라서 SVD는 데이터 압축, 이미지 압축, PCA, 노이즈 제거 등에서 핵심적인 역할을 한다.

---

## 20. SVD와 PCA의 연결
<br>

PCA도 SVD와 매우 밀접하게 연결되어 있다.

데이터 행렬 $X$가 있고, 평균을 제거한 뒤 covariance matrix를 만들면 보통

$$
X^TX
$$

또는

$$
XX^T
$$

형태가 나온다.

그런데 앞에서 본 것처럼

$$
X^TX = V\Sigma^T\Sigma V^T
$$

이다.

즉, PCA의 principal direction은 $X^TX$의 고유벡터이고, 이는 SVD의 오른쪽 특이벡터 $V$와 연결된다.

특이값이 큰 방향은 데이터 분산이 큰 방향이다.

따라서 PCA는 SVD 관점에서 보면 데이터가 가장 크게 퍼져 있는 입력 방향을 찾고, 그 방향들만 남기는 과정이라고 볼 수 있다.

---

## 21. 정리
<br>

SVD는 임의의 행렬

$$
A \in \mathbb{R}^{m \times n}
$$

에 대해 성립하는 가장 강력한 행렬분해 중 하나이다.

$$
A = U\Sigma V^T
$$

이 식은 다음을 의미한다.

1. $V^T$
   - 입력벡터를 입력공간의 특이벡터 방향으로 분해한다.

2. $\Sigma$
   - 각 유효 입력방향을 특이값만큼 스케일하고 출력공간 방향으로 보낸다.

3. $U$
   - 출력공간의 특이벡터 방향으로 다시 합친다.

즉,

$$
Ax =
\sum_{i=1}^{r}
\sigma_i (v_i^Tx)u_i
$$

이다.

이 관점에서 보면 SVD는 다음 내용을 모두 설명한다.

- 입력공간과 출력공간이 다를 수 있다.
- 입력공간은 Row Space와 Null Space로 나뉜다.
- 출력공간은 Range와 Left Null Space로 나뉜다.
- 양의 특이값 개수가 rank이다.
- 특이값 0에 대응하는 입력 방향은 Null Space가 된다.
- Rank-Nullity Theorem은 유효한 특이방향의 개수로 이해할 수 있다.
- Least squares는 $b$를 Range에 projection하는 문제이다.
- Least norm solution은 Null Space 성분을 제거한 가장 작은 norm의 해이다.
- Pseudoinverse는 SVD를 거꾸로 따라가는 연산이다.
- 작은 특이값은 역문제에서 noise를 크게 증폭시킨다.
- 큰 특이값 몇 개만 남기면 low-rank approximation이 된다.

<br>

고유값분해가 같은 공간 안에서

$$
Av_i = \lambda_i v_i
$$

를 보는 분해였다면, SVD는 입력공간과 출력공간 사이에서

$$
Av_i = \sigma_i u_i
$$

를 보는 분해이다.

고유값 $\lambda_i$는 음수일 수 있다. 같은 공간 안에서 방향이 반대로 뒤집히는 작용까지 부호로 표현하기 때문이다.

반면 특이값 $\sigma_i$는 항상 0 이상이다. SVD에서는 입력방향 $v_i$와 출력방향 $u_i$를 따로 정하므로, 부호 반전은 특이벡터 방향 선택에 흡수하고 특이값은 순수한 스케일링 크기로 둔다.

따라서 SVD는 다음 문장으로 기억할 수 있다.

> SVD는 입력공간의 직교방향들이 출력공간의 어떤 직교방향으로 보내지는지, 그리고 그 과정에서 얼마나 스케일되는지를 보여주는 분해이다.

이 관점으로 보면 특이값분해는 단순한 계산 공식이 아니라, 직사각행렬이 입력공간을 어떻게 압축하고, 어떤 방향을 제거하며, 어떤 출력공간만 만들어내는지를 보여주는 해석 도구이다.