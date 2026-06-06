// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Publications organized by category and date.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "A collection of research and engineering projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-linear-algebra-특이값분해의-직관적-이해",
        
          title: "[Linear Algebra] 특이값분해의 직관적 이해",
        
        description: "SVD를 정의역, 공역, 치역, Null Space, Row Space, Least Squares, Least Norm 관점에서 직관적으로 정리",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/01-singularvalue-decomposition/";
          
        },
      },{id: "post-linear-algebra-고유값분해의-직관적-이해",
        
          title: "[Linear Algebra] 고유값분해의 직관적 이해",
        
        description: "대칭행렬의 고유값분해를 고유벡터 방향, 스케일링, Null Space, Range, 2-norm, definiteness 관점에서 직관적으로 정리",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/00-eigenvalue-decomposition/";
          
        },
      },{id: "post-paper-review-rocket-landing-control-with-random-annealing-jump-start-reinforcement-learning",
        
          title: "[Paper Review] Rocket Landing Control with Random Annealing Jump Start Reinforcement Learning",
        
        description: "기존 baseline controller를 guide policy로 활용하여 sparse reward 기반 로켓 착륙 제어를 학습하는 RAJS 방법 리뷰",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/rocket-landing-annealing/";
          
        },
      },{id: "post-paper-review-hierarchical-reinforcement-learning-for-air-to-air-combat",
        
          title: "[Paper Review] Hierarchical Reinforcement Learning for Air-to-Air Combat",
        
        description: "AlphaDogfight Trials에서 2위를 기록한 Lockheed Martin의 계층적 강화학습 기반 공대공 전투 에이전트 PHANG-MAN 리뷰",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/phangman/";
          
        },
      },{id: "post-convex-optimization-18-numerical-linear-algebra",
        
          title: "[Convex Optimization] 18. Numerical Linear Algebra",
        
        description: "실제 솔버 및 다양한 연산에서 선형대수의 수치적 분석",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/num-lin-alg/";
          
        },
      },{id: "post-convex-optimization-17-quasi-newton-method",
        
          title: "[Convex Optimization] 17. Quasi Newton Method",
        
        description: "Newton Method의 헤시안을 근사하는 Second-order method",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/quasi-newton-method/";
          
        },
      },{id: "post-mehrotra-predictor-corrector-method",
        
          title: "Mehrotra Predictor-Corrector Method",
        
        description: "Primal-dual interior-point method로 실제 솔버 제작 시 널리 쓰이는 Mehrotra predictor-corrector method 분석",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/00-mehrotra-predictor-corrector-method/";
          
        },
      },{id: "post-convex-optimization-16-primal-dual-interior-point-methods",
        
          title: "[Convex Optimization] 16. Primal-dual interior-point methods",
        
        description: "Inequality and equality constrained problem을 효율적으로 풀기 위한 핵심 2nd order method인 Primal-dual interior-point method의 정의 및 분석",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/00-primal-dual-interior-point-method/";
          
        },
      },{id: "post-convex-optimization-15-barrier-method",
        
          title: "[Convex Optimization] 15. Barrier Method",
        
        description: "Inequality and equality constrained problem을 풀기 위한 second-order method 중 하나인 Barrier Method 정의 및 분석",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/00-barrier-method/";
          
        },
      },{id: "post-convex-optimization-14-newton-39-s-method",
        
          title: "[Convex Optimization] 14. Newton&#39;s Method",
        
        description: "Second-order method의 대표적인 알고리즘인 Newton&#39;s Method 정의 및 분석",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/00-newton-method/";
          
        },
      },{id: "post-convex-optimization-13-duality-uses-and-correspondences",
        
          title: "[Convex Optimization] 13. Duality uses and correspondences",
        
        description: "Duality의 활용법 및 primal-dual 간의 대응 관계 파악",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/00-duality-correspondences/";
          
        },
      },{id: "post-convex-optimization-12-kkt-conditions",
        
          title: "[Convex Optimization] 12. KKT conditions",
        
        description: "Karush-Kuhn-Tucker (KKT) Conditions에 대한 분석",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/00-kkt-conditions/";
          
        },
      },{id: "post-convex-optimization-11-duality-in-general-programs",
        
          title: "[Convex Optimization] 11. Duality in General Programs",
        
        description: "General Programs에서 Lagrangian 정의 및 Duality gap 분석",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/00-duality-general/";
          
        },
      },{id: "post-convex-optimization-10-duality-in-linear-programs",
        
          title: "[Convex Optimization] 10. Duality in Linear Programs",
        
        description: "Linear Programs에서 Duality 정의 및 특징 파악",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/01-duality-linear/";
          
        },
      },{id: "post-convex-optimization-01-introduction-amp-roadmap",
        
          title: "[Convex Optimization] 01.Introduction &amp; Roadmap",
        
        description: "Ryan Tibshirani 교수님의 Convex Optimization 강의 정리 및 학습 개요",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/00-convex-intro/";
          
        },
      },{id: "post-unified-approach-optimization-to-deep-rl",
        
          title: "Unified Approach: Optimization to Deep RL",
        
        description: "최적화, 제어, 강화학습, 딥러닝 그리고 논문 리뷰까지 한 번에 테스트하는 예제 글입니다.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/unified-approach/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "projects-rlv-landing-simulation-simulink-unity",
          title: 'RLV Landing Simulation (Simulink-Unity)',
          description: "Reusable Launch Vehicle landing simulation connecting MATLAB/Simulink and Unity.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_rlv_landing/";
            },},{id: "projects-sac-based-obstacle-avoidance-in-pybullet",
          title: 'SAC-based Obstacle Avoidance in PyBullet',
          description: "Single agent obstacle avoidance and goal reaching using Soft Actor-Critic.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_pybullet_obstacle_avoidance/";
            },},{id: "projects-drone-obstacle-avoidance-via-scp",
          title: 'Drone Obstacle Avoidance via SCP',
          description: "6-DOF drone trajectory optimization using Sequential Convex Programming.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_drone_scp/";
            },},{id: "projects-model-based-intervention-learning-mile",
          title: 'Model-based Intervention Learning (MILE)',
          description: "Addressing action delay in RL environments (LunarLander &amp; BipedalWalker).",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_mile_rl/";
            },},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/example_pdf.pdf", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/hjun-dev", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%31%32%32%30%30%36%31%37@%69%6E%68%61.%65%64%75", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
