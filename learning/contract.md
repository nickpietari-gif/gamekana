---
type: Module Contract
title: Exploration rules contract
description: Movement, searched-stone jumping, one-time search, deposits, and ordered stroke assembly.
---
# Exploration rules contract

`learning` depends only on `content`, with no UI or persistence. Walking takes one cardinal step into a non-obstacle cell; jumping advances two cardinal cells only if the intervening stone was already inspected and the landing tile is free. A stone reveals at most one generic shard on its first valid inspection. Deposits require proximity to the fixed base/anvil. `placeStroke` requires the next unplaced stroke of the first uncrafted vowel, an available stored shard and anvil proximity; each successful placement spends one shard, and the final placement completes that kana. Wrong-order attempts must not alter state or inventory. Completed vowels are ordered and cannot be recrafted.
