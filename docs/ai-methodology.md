# WILDSHIELD AI — Artificial Intelligence & Machine Learning Methodology

## 1. Computer Vision: WildShield-Vision-TaxonNet (v2.1)

### A. Problem Statement
Accurately categorizing wildlife species from opportunistic smartphone camera captures in variable lighting conditions, motion blur, and dense foliage without generating deceptive overconfidence.

### B. Dual-Stage Inference Pipeline
1. **Optical Quality Assessment**:
   - Focus analysis via discrete 2D Laplacian operator variance ($\sigma^2_{Lap} = \text{Var}(\nabla^2 I)$).
   - Illumination histogram evaluation across luminance channel ($Y \in [0, 255]$).
   - Rejection/degradation labeling for images below $\sigma^2_{Lap} < 80$ (motion blurred) or $Y < 40$ (underexposed night captures).
2. **Taxonomic Classification & Calibration**:
   - Multi-scale visual feature extraction matching 9 native species profiles (Asian Elephant, Indian Leopard, Bengal Tiger, Sloth Bear, Wild Boar, Spotted Deer, Sambar Deer, Rhesus Macaque, Spectacled Cobra).
   - Softmax score calibrated into 4 distinct confidence tiers:
     - **High ($\ge 0.80$)**: Clear morphological match; species candidate suggested.
     - **Medium ($0.50 - 0.79$)**: Multiple candidates identified; human officer verification requested.
     - **Low / Uncertain ($< 0.50$)**: Formally marked as *"Unable to identify confidently"* to prevent false alarms.
   - Bounding box estimation returning normalized coordinates $[y_{min}, x_{min}, y_{max}, x_{max}]$.

---

## 2. Conflict Risk Prediction: WildShield-Risk-SpatialXGB (v1.4)

### A. Philosophy & Guardrails
- **Area-Level Probability**: The model estimates conflict risk within a defined geographic boundary and forecast window (e.g. 12-24 hours).
- **No Individual Trajectory Fabrication**: The platform strictly avoids drawing speculative movement vectors between independent observations.

### B. Mathematical Model
Let historical observations in spatial neighborhood $N(x_0, y_0, R)$ over time window $T$ be denoted as $\{(x_i, y_i, t_i, s_i)\}_{i=1}^M$, where $s_i$ is severity weight ($s_{high} = 1.5, s_{normal} = 1.0$).

The decay-weighted conflict density $D$ is computed as:
$$D(x_0, y_0, t) = \sum_{i=1}^M s_i \cdot \exp\left(-\lambda (t - t_i)\right)$$

Where:
- $\lambda = 0.01\text{ hr}^{-1}$ reflects a biological half-life of approximately 3 days for transient herd movements.
- Calibrated risk score: $R(x_0, y_0) = 1.0 - \exp\left(-\frac{D}{6.0}\right) \in [0.08, 0.98]$.

### C. Explainable AI (XAI)
Every inference output generates human-readable contributing indicators:
1. Incident volume and dominant taxon breakdown in recent 30-day window.
2. Proximity to perennial agricultural water sources (e.g., irrigation canals) or reserve forest boundaries.
3. Agricultural harvest calendar overlap (nocturnal forage pressure during paddy/sugarcane harvest).
4. Explicit model uncertainty metrics ($U \in [0.06, 0.45]$) based on observation density.
