---
layout: page
title: Survival Analysis in Poisoning (SURF 2024)
description: Summer Undergraduate Research Fellowship 2024.
importance: 2
category: work
related_publications: false
---

Summer Undergraduate Research Fellowship (SURF) project on survival analysis applied to poisoning data.

## Environment setup (from the original project site)

The project was developed with RStudio + reticulate, using Python packages for survival analysis:

```r
library(reticulate)
py_install('pandas')
py_install('matplotlib')
py_install('numpy')
py_install('jupyter')
py_install('scikit-learn')
reticulate::repl_python()
py_install('scikit-survival')
```

> I never really found an IDE that I liked... Most Python users I met seem to think IDEs are not really important, which confuses me even further. That's what you look at the entire time while programming! Once you get familiar with RStudio, or anyway Posit IDE, you are spoiled. Therefore, I decided to continue to teach and code in RStudio, even with Python or Jupyter notebooks.
