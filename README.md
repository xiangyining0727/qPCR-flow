# qPCRflow

**A lightweight web tool streamlining qPCR workflows: master mix calculation, plate layout, and data analysis.**

**一款轻量级网页工具，一站式解决 qPCR 的配液计算、上样排版与数据分析。**

---

## 🌟 Features / 核心功能

### 🧪 1. Smart Preparation / 精准配液计算

* Separates Master Mix and cDNA dilution calculations. Supports customizable overage margins (%) to perfectly match wet-lab habits.
* 分管计算 Mix+Primer 与 cDNA 稀释体积，支持自定义配液耗材余量（%），生成直观的配液清单，直接拿着去操作台。

### 🎨 2. Visual Plate Layout / 可视化孔板排版

* Auto-generates 96-well plate mockups based on biological and technical replicates. Color-coded groups prevent pipetting errors.
* 根据生物学和技术重复参数，自动生成 96 孔板上样分布图。通过颜色直观区分实验组与对照组，彻底告别加样眼花。

### 📊 3. Seamless Data Analysis / 自动化数据分析

* Simply paste raw CT exports from the machine. The tool auto-infers columns, performs Welch/Student t-test on ΔCt, and flags QC warnings.
* 直接粘贴 qPCR 仪导出的原始 CT 表格，系统自动推断数据列与分组。内置基于 ΔCt 的 Welch / Student t-test 差异分析，并提供数据质控（QC）警告。

### 💾 4. Flexible Export / 多维度数据导出

* One-click export for summary, detailed, or raw data in CSV formats.
* 支持按需一键导出汇总分析、明细数据或原始数据的 CSV 文件，无缝衔接下游作图。

---

## 🚀 How to Use / 使用流程

1. **Prep (前期准备):** Input your experimental design (genes, samples, replicates, template volume).
2. **Pipette (实验操作):** Follow the generated prep lists and the 96-well plate map to load your samples.
3. **Analyze (结果计算):** Paste the raw CT table, map your samples, choose your statistical test, and hit calculate.
4. **Export (导出):** Download the results in your preferred CSV format.

1. **前期准备:** 输入基因数、样本数、重复数及反应体系。
2. **实验操作:** 参照生成的配液清单和 96 孔板排版图完成湿实验操作。
3. **结果计算:** 粘贴仪器导出的原始 CT 表格，核对样本映射，选择统计检验方法并计算。
4. **导出:** 下载所需的 CSV 结果文件。

---

## 🛠 Tech Stack / 技术栈

* Pure Front-end Application (HTML / CSS / JavaScript)
* Hosted on GitHub Pages

## 📬 Contact / 联系方式

If you encounter any issues or have feature suggestions, feel free to reach out:

如有问题或建议，欢迎联系：**xiangyining0727@gmail.com**
