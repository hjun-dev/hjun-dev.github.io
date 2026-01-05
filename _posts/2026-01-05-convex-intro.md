---
layout: post
title: "[Convex Optim] 
00.Introduction & Roadmap"
description: "Ryan Tibshirani 교수님의 Convex Optimization 강의 정리 및 학습 개요"
date: 2026-01-05 13:00:00
tags: [math, study, optimization]
categories: [optimization]
related_posts: false
toc:
  sidebar: left
---

## 1. Introduction

최적화 이론은 다양한 논문과 강의에서 자주 등장하며 연구를 진행하는 과정에서도 필요에 따라 접하게 되는 경우가 많습니다.
Duality, KKT 조건, Newton 계열 방법과 같은 개념들이 자연스럽게 사용되지만, 이를 하나의 강의 흐름에 따라 처음부터 끝까지 따라가며 정리해본 경험은 많지 않았습니다. 이러한 이유로, 최적화 이론을 강의의 구조를 따라 제대로 공부해볼 필요가 있겠다는 생각을 하게 되었습니다.

CMU의 Ryan Tibshirani 교수님의 **Convex Optimization (Fall 2019, 10-725)** 강의는 기본적인 정의와 개념부터 알고리즘, 그리고 비교적 고급 주제까지를 일관된 흐름 속에서 다루고 있어 학습 자료로 선택하게 되었습니다.

이 시리즈는 해당 강의를 따라가며 강의에서 다루는 내용을 정리하고, 이해 과정에서 중요하다고 느낀 부분이나 보충이 필요한 설명을 함께 기록하는 것을 목표로 합니다.
---

### Main References

이 시리즈는 다음 두 가지 자료를 핵심 레퍼런스로 삼아 진행합니다.

1. **CMU 10-725: Convex Optimization (Fall 2019)**  
   Ryan Tibshirani 교수님의 강의 자료와 영상  
   [https://www.stat.cmu.edu/~ryantibs/convexopt/](https://www.stat.cmu.edu/~ryantibs/convexopt/)

2. **Convex Optimization for All**  
   위 강의를 바탕으로 정리된 오픈 소스 한글 노트  
   [https://convex-optimization-for-all.github.io/](https://convex-optimization-for-all.github.io/)

이 시리즈 역시 위 자료를 참고하며 정리하였기 때문에 내용상 유사한 부분이 많을 수 있습니다. 다만 여기서는 개인적으로 이해하는 과정에서 중요하다고 느낀 설명이나 
강의 슬라이드에서 바로 연결되지 않는 부분들을 중심으로 
개인적인 해석과 보충 설명을 덧붙여 기록하고자 합니다.
---
## 2. Goals & Direction

이 글들의 목적은 다음과 같습니다.

* 강의에서 제시되는 **정의–정리–알고리즘**의 흐름을 따라가며 내용을 정리합니다.
* 결과만 받아들이기보다는 왜 이러한 정의와 조건이 등장하는지에 대한 설명을 가능한 범위 내에서 함께 정리합니다.
* 강의 슬라이드에서 빠르게 지나가거나 생략된 수식 전개가 있는 경우, 이해에 필요하다고 판단되면 이를 보완하여 기록합니다.
* 개인적인 이해를 기준으로 정리하며 이후 다시 읽었을 때 흐름을 빠르게 떠올릴 수 있는 형태를 목표로 합니다.

이 시리즈는 특정 응용이나 구현을 목적으로 하지 않습니다. 
강의 내용을 따라가며 최적화 이론을 차분히 정리하는 데 초점을 둡니다.

---

## 3. Roadmap

학습 순서는 **CMU 10-725 강의의 실제 진행 흐름**을 그대로 따릅니다.  
각 주제는 분량과 내용에 따라 여러 글로 나뉠 수 있으며, 
필요한 경우 앞뒤 강의 내용을 함께 참고하여 정리할 예정입니다.

### Theory I: Fundamentals
- Convexity I: Sets and Functions  
- Convexity II: Optimization Basics  
- Canonical Problem Forms  

### Algorithms I: First-order Methods
- Gradient Descent  
- Subgradients  
- Subgradient Method  
- Proximal Gradient Descent  
- Stochastic Gradient Descent  

### Theory II: Duality and Optimality
- Duality in Linear Programs  
- Duality in General Convex Programs  
- KKT Conditions  
- Uses of Duality and Correspondences  

### Algorithms II: Second-order Methods
- Newton’s Method  
- Barrier Method  
- Primal-Dual Interior-Point Methods  
- Quasi-Newton Methods  

### Advanced Topics
- Numerical Linear Algebra  
- Coordinate Descent  
- Dual Decomposition  
- Alternating Direction Method of Multipliers (ADMM)  
- Frank–Wolfe Method  
- Modern Stochastic Methods  
- First-order Nonconvex Optimization  
- Bregman Proximal Methods  

---

## 4. Closing

강의의 흐름을 따라가며 꾸준히 정리하는 것이 목표입니다. 이 기록이 이후 최적화 이론을 다시 공부하거나 논문을 읽을 때 참고할 수 있는 개인적인 정리 노트로 남기를 바랍니다. 같은 주제에 관심 있는 분들께도 참고가 된다면 좋겠습니다.
