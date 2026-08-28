---
layout: post
title: Exact Confidence Bounds for an Exponential Parameter under Hybrid Censoring
date: 2024-05-15
description: Reading note on exact confidence bounds in hybrid censoring.
tags: [reading, statistics, memo]
---

The reading before reminds us the exact confidence bounds in hybrid censoring (Chen, 1987), maybe we can compare the conditional variance here. Here we also include the discussion on (Balakrishnan, 2013).

## Introduction

> Type-I and Type-II censoring schemes are the two most common and popular censoring schemes. In Type-I censoring scheme, the experimental time is fixed, but the number of observed failures is a random variable. On the other hand, in Type-II censoring scheme, number of observed failures is fixed, but the experimental time is a random variable. The mixture of Type-I and Type-II censoring schemes is known as hybrid censoring scheme, and it can be described as follows.
Consider the following life-testing experiment in which n units are placed on test. The lifetimes of the sample units are assumed to be independent and identically distributed (i.i.d.) random variables. Let the ordered lifetimes of these units be denoted by $X_{1:n}, \cdots , X_{n:n}$, respectively. The test is terminated when a pre-fixed number, $r < n$, out of n items has failed, or when a pre-fixed time, $T$, has been reached. In other words, the life-test is terminated at a random time $T_* = \min\{X_{r:n}, T \}$. It is also usually assumed that the failed units are not replaced in the experiment

Suppose $n$ units i.i.d. exponential,

$$
f(x)=\frac{1}{\theta}\exp(-x/\theta), \quad x>0, \quad \theta>0,
$$

are placed for some life test, where the failed items are not replaced.

Denote $D^*$ and $D$, the numbers of units that would fail before $T^*$ and $T$, respectively, and set

$$
\begin{align}
S&=\sum_{i=1}^{D^*}X_{i,n}+(n-D^*)T^* \quad &D^* >1 \\
&=nT & D^*=0
\end{align}
$$

which is called total time on test. Thus, the hybrid censored data from exponential distribution.

## Discussion of $\hat{\theta}$

Here maybe we can apply some new ideas.
