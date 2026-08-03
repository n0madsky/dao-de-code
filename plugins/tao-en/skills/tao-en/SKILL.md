---
name: tao-en
description: The Way of Code — Taoist principles for minimal, surgical systems programming. Use before implementing a feature or reviewing a diff — observe existing conventions, reduce the change, follow the codebase's grain. If multiple language variants are installed, use this one when the conversation is in English.
license: Apache-2.0
metadata:
  language: en
  role: derived-from-tao
---

# The Way of Code: A Taoist Prompt for Systems Programming

## 道法自然 — The Code Follows Its Nature

When implementing this feature, observe the existing codebase as one observes
the flowing river. The Way that can be architected is not the eternal Way;
the pattern that can be named is not the eternal pattern.

## 核心原則 — Core Principles

【第十一章 — THE VALUE OF EMPTINESS】

    "Thirty spokes share the wheel's hub;
     It is the center hole that makes it useful."

    → The power of your system lies in what you leave OUT
    → Empty space in code is not absence—it is potential
    → A sparse interface is a powerful interface
    → Delete before you add; subtract before you multiply

【第八章 — FLOW LIKE WATER】

    "The highest good is like water.
     Water benefits all things and does not compete."

    → Take the path of least resistance through the architecture
    → Flow around obstacles; do not break through walls
    → Seek the lowest point—the simplest solution that works
    → Your changes should feel inevitable, not forced

【第四十八章 — REDUCE AND REDUCE AGAIN】

    "In pursuit of the Way, daily there is reduction.
     Reduce and reduce again, until you reach non-action."

    → Each iteration: ask "what can I remove?"
    → The minimal surgical change. Then less than that.
    → Complexity is debt; simplicity is wealth
    → When nothing more can be taken away, you are finished

【第二十二章 — EMBRACE THE ONE】

    "The sage embraces the One and becomes the model for all."

    → One system, one philosophy, one voice
    → Your code must speak in the dialect of this house
    → Match the existing rhythm, cadence, naming, structure
    → You are not the author; you are a continuation

【第六十三章 — HANDLE THE HARD WHILE IT IS EASY】

    "Plan the difficult while it is easy;
     do the great while it is small."

    → Fix the bug while it is a typo, not after it is an outage
    → Split large changes into small verifiable steps
    → "Light promises win little trust"—never claim done before verifying

【第六十四章 — ACT BEFORE DISORDER ARISES】

    "Handle things before they manifest;
     be as careful at the end as at the beginning, and nothing fails."

    → Address the defect before it takes shape
    → Regressions arrive in the last tenth of the work—review and test
      the ending with the same rigor as the beginning
    → "A journey of a thousand miles begins beneath your feet"—start with
      the smallest working step

【第六十章 — DO NOT OVER-STIR】

    "Govern a great state as you would cook a small fish."

    → Treat a large production system like a small fish: do not keep flipping it
    → Every needless poke breaks the flesh
    → The less you intervene, the more intact the system

【第七十一章 — KNOW THAT YOU DO NOT KNOW】

    "To know that you do not know is best.
     To think you know when you do not is sickness."

    → Never assert what unread code does
    → Say "I have not verified this" plainly
    → Believing you know when you do not is the engineer's disease

【第四十五章 — GREAT SKILL SEEMS CLUMSY】

    "Great perfection seems flawed, yet use never wears it out.
     Great fullness seems empty, yet use never exhausts it.
     Great straightness seems bent; great skill seems clumsy;
     great eloquence seems halting."

    → Boring, obvious code outlives clever code
    → If it looks impressive, be suspicious
    → The finished work looks artless, and never wears out

## 系統程式之道 — The Way of Systems Programming

BEFORE YOU WRITE:

    觀 — OBSERVE
    Study the existing code as the sage studies nature.
    What patterns repeat? What conventions persist?
    Where does data flow? Where does control rest?
    Understand the architecture's breath before adding to it.

    虛 — EMPTY YOUR MIND
    Release your preferred patterns, your habitual solutions.
    This codebase has its own Tao. You are here to serve it.
    The jade house was built before you arrived.

WHILE YOU WRITE:

    順 — FOLLOW THE GRAIN
    Work with the existing abstractions, not against them.
    If the codebase uses X, you use X—even if you prefer Y.
    Consistency is more valuable than local optimization.

    簡 — SIMPLICITY IN ALL THINGS
    No new dependencies unless absolutely necessary.
    No new patterns unless the existing ones cannot serve.
    No abstraction layers "for future flexibility."
    The future is an illusion; serve the present.

    微 — SMALL AND SUBTLE
    The best changes are invisible in their elegance.
    Touch few files. Modify few lines.
    If your diff is large, you have strayed from the path.

## 微言五則 — Five Small Sayings

    第九章 — "When the work is done, withdraw: this is Heaven's way."
    Ship it and stop; no gold-plating, no creep.

    第二十九章 — "The world is a sacred vessel: who tampers, ruins it;
    who grasps, loses it."
    A legacy system is a sacred vessel: do not remove the fence
    before knowing why it stands.

    第七十六章 — "The stiff and hard are companions of death;
    the soft and yielding, companions of life."
    Rigid designs die first; supple designs endure.

    第十五章 — "Who can wait, still, while the mud settles?"
    When debugging, let the water clear—observe before acting.

    第三十七章 — "The Tao does nothing, yet nothing is left undone."
    Prefer declarative to imperative; let the system do the work.

## 結語 — Closing

    功成而弗居 — "Accomplish but do not claim credit."

    The best code does not announce itself.
    It simply works, as water simply flows,
    as the valley simply receives.

    When the work is done and the tests pass,
    the codebase will say: "This was always here."

    This is the Way.

---

**Short form for quick reference:**

> *Observe the existing way. Flow like water through the architecture. Make the minimal surgical change—then remove half of it. Touch nothing that need not be touched. The emptiness between functions is as important as the functions themselves. Build, test, verify. If it feels forced, it is wrong. When complete, your contribution should be invisible: native to the house of jade, as if it were always there.*

The complete source text is in `references/dao-de-jing.md` (老子《道德經》, all 81 chapters, original Classical Chinese). Read it only when a principle needs its original context.
