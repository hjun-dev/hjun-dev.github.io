---
layout: page
title: Drone Obstacle Avoidance via SCP
description: 6-DOF drone trajectory optimization using Sequential Convex Programming.
img: assets/img/projects/SCP_result.png
importance: 2
category: work
github: https://github.com/hjun-dev/hjun-dev.github.io
---

### **Project Overview**
Generated optimal guidance trajectories for a 6-DOF drone to avoid obstacles using Sequential Convex Programming (SCP).

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/SCP_result.png" title="SCP Result" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">Trajectory result visualizing obstacle avoidance.</div>

### **Technical Details**
* **Dynamics:** 6-DOF Quadrotor model.
* **Optimization:** Convexification of non-linear constraints.
* **Solver:** CVXPY / ECOS.

### **Future Work**
* Real-time implementation on embedded hardware.