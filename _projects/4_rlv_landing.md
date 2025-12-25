---
layout: page
title: RLV Landing Simulation (Simulink-Unity)
description: Reusable Launch Vehicle landing simulation connecting MATLAB/Simulink and Unity.
img: assets/img/projects/rlv_landing.gif
importance: 1
category: work
github: https://github.com/hjun-dev/hjun-dev.github.io
---

### **Project Overview**
Developed a high-fidelity visual simulation for Reusable Launch Vehicle (RLV) landing. The control logic runs on Simulink, while Unity handles the physics visualization via UDP communication.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/rlv_landing.gif" title="RLV Landing" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">Simulink control inputs visualizing in Unity engine.</div>

### **System Architecture**
* **Control Logic:** MATLAB / Simulink
* **Visualization:** Unity 3D Engine
* **Communication:** UDP

### **Key Features**
* Real-time trajectory tracking.
* Disturbance simulation.