---
layout: page
title: Model-based Intervention Learning (MILE)
description: Addressing action delay in RL environments (LunarLander & BipedalWalker).
img: assets/img/projects/mile_thumb.gif 
importance: 1
category: work
github: https://github.com/hjun-dev/hjun-dev.github.io
---

### **Project Overview**
This project reimplements the **Model-based Intervention Learning (MILE)** framework and applies it to two Gymnasium environments:

- **LunarLander** — *discrete action space*
- **BipedalWalker** — *continuous action space*

The purpose of this work is to **reproduce the MILE pipeline and observe its behavior in practice**, rather than propose a new algorithm.  
A suboptimal policy is intentionally trained first, and MILE-based intervention is introduced later to evaluate:

- how much the policy improves during intervention-learning,
- how the agent’s behavior changes qualitatively (stability, correction patterns, decision tendencies).

This project focuses on **implementation, application, and behavioral analysis** to see how MILE actually affects policy learning outcomes when used on imperfect agents.


### **Demos**
<div class="row">
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/LL_round_2_mile.gif" title="LunarLander" class="img-fluid rounded z-depth-1" %}
        <div class="caption">LunarLander Environment</div>
    </div>
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/BW_round_5_mile.gif" title="BipedalWalker" class="img-fluid rounded z-depth-1" %}
        <div class="caption">BipedalWalker Environment</div>
    </div>
</div>

### **Methodology**
* **Problem:** (Details to be added...)
* **Solution:** MILE (Details to be added...)

### **Results**
(Details to be added...)