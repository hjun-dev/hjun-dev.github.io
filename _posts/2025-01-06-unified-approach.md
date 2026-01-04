---
layout: post
title: "Unified Approach: Optimization to Deep RL"
date: 2025-01-06 09:00:00 +0900
description: "최적화, 제어, 강화학습, 딥러닝 그리고 논문 리뷰까지 한 번에 테스트하는 예제 글입니다."
tags: [test, tutorial, math, code]
categories: [optimization, control, reinforcement-learning, deep-learning, paper-review]
---

## 1. Introduction (Paper Review)

이 포스트는 블로그의 모든 카테고리 기능이 정상 작동하는지 확인하기 위한 테스트 글입니다. 최근 연구 트렌드는 고전적인 제어 이론과 현대적인 딥러닝 기법의 융합에 주목하고 있습니다.

> **Key Idea**: 모델 기반 제어(MPC)의 안전성과 강화학습(RL)의 유연성을 결합해보자.

---

## 2. Optimization Problem

항공우주 시스템의 궤적 최적화 문제는 보통 다음과 같은 비선형 최적화 문제(NLP)로 정식화됩니다. **MathJax** 수식이 잘 렌더링되는지 확인해 보세요.

$$
\begin{aligned}
\min_{u} \quad & J = \int_{t_0}^{t_f} (x^T Q x + u^T R u) \, dt \\
\text{s.t.} \quad & \dot{x} = f(x, u) \\
& x_{min} \le x \le x_{max} \\
& u_{min} \le u \le u_{max}
\end{aligned}
$$

여기서 $Q$와 $R$은 가중치 행렬입니다.

---

## 3. Control & Reinforcement Learning

제어 로직을 Python 코드로 구현할 때, 코드 하이라이팅이 잘 되는지 확인합니다. 아래는 간단한 **PyTorch** 기반의 RL 에이전트 구조입니다.

```python
import torch
import torch.nn as nn

class Actor(nn.Module):
    def __init__(self, state_dim, action_dim):
        super(Actor, self).__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, 256),
            nn.ReLU(),
            nn.Linear(256, 256),
            nn.ReLU(),
            nn.Linear(256, action_dim),
            nn.Tanh() # Action range: [-1, 1]
        )

    def forward(self, state):
        return self.net(state)

# Initialize Agent
agent = Actor(state_dim=12, action_dim=4)
print("RL Agent initialized.")
```

제어 로직을 Python 코드로 구현할 때, 코드 하이라이팅이 잘 되는지 확인합니다. 아래는 간단한 **PyTorch** 기반의 RL 에이전트 구조입니다.
