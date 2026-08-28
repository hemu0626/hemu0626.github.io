---
layout: post
title: Memo KataGo
date: 2024-08-22
description: Notes on reproducing the KataGo training setup.
tags: [Go, Code, memo]
---

#### Attempt to reproduce the code

<https://katagotraining.org/>

#### Installation

```sh
py -m pip install -U katrain
py -m katrain
```

#### Code Clone

```sh
git clone https://github.com/lightvector/KataGo.git

cd KataGo

nano src/main.cpp  # check main.cpp
```

#### Check Main

```python
import os
os.system("nano src/main.cpp")
```
