# New UI feedback

> **NOTE**: I didn't check the code.

## Table of Contents

<!-- toc -->

- [:ballot_box_with_check: What I love](#ballot_box_with_check-what-i-love)
  * [:ballot_box_with_check: Badges and icons](#ballot_box_with_check-badges-and-icons)
  * [:ballot_box_with_check: "Contributed to" and external link icon](#ballot_box_with_check-contributed-to-and-external-link-icon)
  * [:ballot_box_with_check: Repo descriptions next to repo name](#ballot_box_with_check-repo-descriptions-next-to-repo-name)
  * [:ballot_box_with_check: One-liner contributions](#ballot_box_with_check-one-liner-contributions)
- [:black_square_button: What I like](#black_square_button-what-i-like)
  * [:ballot_box_with_check: "Member of" is gone](#ballot_box_with_check-member-of-is-gone)
  * [:black_square_button: What you put instead of the progress bars](#black_square_button-what-you-put-instead-of-the-progress-bars)
  * [:ballot_box_with_check: You removed the tab at the top](#ballot_box_with_check-you-removed-the-tab-at-the-top)
  * [:ballot_box_with_check: Big space at the bottom of the page](#ballot_box_with_check-big-space-at-the-bottom-of-the-page)
  * [:ballot_box_with_check: 10 stars for bronze contributions](#ballot_box_with_check-10-stars-for-bronze-contributions)
  * [:ballot_box_with_check: You display the repo owners](#ballot_box_with_check-you-display-the-repo-owners)
- [:black_square_button: What I like less](#black_square_button-what-i-like-less)
  * [:black_square_button: You're too generous](#black_square_button-youre-too-generous)
- [:black_square_button: What I think was better before](#black_square_button-what-i-think-was-better-before)
  * [:ballot_box_with_check: Link to commits and PRs](#ballot_box_with_check-link-to-commits-and-prs)
  * [:black_square_button: Tooltips](#black_square_button-tooltips)
  * [:ballot_box_with_check: Ordering](#ballot_box_with_check-ordering)
- [:black_square_button: Broken things](#black_square_button-broken-things)
  * [:black_square_button: "explanation here" link](#black_square_button-explanation-here-link)
  * [:ballot_box_with_check: Total amount of stars](#ballot_box_with_check-total-amount-of-stars)
- [:black_square_button: Minor things](#black_square_button-minor-things)
  * [:ballot_box_with_check: Browser console warning](#ballot_box_with_check-browser-console-warning)
  * [:ballot_box_with_check: Mini avatars on the one-liner contributions](#ballot_box_with_check-mini-avatars-on-the-one-liner-contributions)
  * [:black_square_button: Other stuff](#black_square_button-other-stuff)
  * [:ballot_box_with_check: Readme to be adapted?](#ballot_box_with_check-readme-to-be-adapted)
  * [:black_square_button: Screenshots to be adapted](#black_square_button-screenshots-to-be-adapted)

<!-- tocstop -->

## :ballot_box_with_check: What I love

### :ballot_box_with_check: Badges and icons

They look really nice!

### :ballot_box_with_check: "Contributed to" and external link icon

Thanks for having kept that!

### :ballot_box_with_check: Repo descriptions next to repo name

Good move!

### :ballot_box_with_check: One-liner contributions

That's really cool!

## :black_square_button: What I like

### :ballot_box_with_check: "Member of" is gone

I can see some users complaining about it but I guess it's a good move and this gives us room to
spare some API queries.

### :black_square_button: What you put instead of the progress bars

I really liked the progress bars, but I have to admit that what you created instead looks quite
cool as well.

Update: it seems to contain some debugging info now. You're probably still working on that part :)

### :ballot_box_with_check: You removed the tab at the top

I liked that tab because it made our UI very similar to GitHub (which is very important to me) but
that was taking space and you probably did a good move.

### :ballot_box_with_check: Big space at the bottom of the page

Maybe too big, but it feels better than before.

### :ballot_box_with_check: 10 stars for bronze contributions

Avoids the war on the number of commits as you said, so probably a good move.

### :ballot_box_with_check: You display the repo owners

Probably a good move, because `ghuser-io/db` makes more sense than just `db` ;)

## :black_square_button: What I like less

### :black_square_button: You're too generous

I get a silver contrib for Reframe, 100 stars out of it, this feels strange honestly, because I
barely touched Reframe. I suspect silver contributions are too easy to get and/or too rewarding.

## :black_square_button: What I think was better before

### :ballot_box_with_check: Link to commits and PRs

On small contributions, it was possible to jump directly to my commits and PRs, so you could quickly
get to my code.

### :black_square_button: Tooltips

When hovering badges, I was seeing hard facts, like exact number of commits, exact contrib size,
"last pushed one month ago".

Update: yay, you resurrected the tooltips, thanks! Wouldn't it be better to have some hard fact
instead of "seems to be a small project", which basically repeats what's already on the badge?
Maybe you could state the amount of commits in that tooltip?

Update 2: agreed that facts will be part of the expandable

### :ballot_box_with_check: Ordering

If it's better for everyone, keep it, my own profile isn't that important. But if I look at my own
profile:

* ghuser is popular, mature, active, collaborative and I wrote 98% of it. How can it be only number
  4?
* I'm quite proud of reframe-on-up, much more than myberl.in and mybeir.ut (but I don't expect any
  algorithm to be able to notice that I'm not proud of mybeir.ut, so don't worry). Still
  reframe-on-up is a one-liner contrib at the bottom. I don't understand why.
* Writing this, I understand what bothers me most: I can't understand/reverse-engineer the sorting
  algorithm and it makes me suspect a bug.

## :black_square_button: Broken things

### :black_square_button: "explanation here" link

Doesn't lead to an explanation, but good move though.

### :ballot_box_with_check: Total amount of stars

I think it's not the sum of all the contributions anymore. I didn't check precisely, but if I get now
100 stars for Reframe, my total should be around 800 stars, right?

## :black_square_button: Minor things

### :ballot_box_with_check: Browser console warning

```
Warning: Received `false` for a non-boolean attribute `title`.

If you want to write it to the DOM, pass a string instead: title="false" or title={value.toString()}.

If you used to conditionally omit it with title={condition && value}, pass title={condition ? value : undefined} instead.
    in div (created by Badge)
    in div (created by Badge)
    in div (created by Badge)
    in Badge (created by ContribType)
...
```

### :ballot_box_with_check: Mini avatars on the one-liner contributions

I'd love to have mini org/repo avatars on the one-liner contributions.

### :black_square_button: Other stuff

![other](other.png)

### :ballot_box_with_check: Readme to be adapted?

Some sentences of the [readme](https://github.com/ghuser-io/ghuser.io#what-we-are-building) might
now be incorrect, e.g.:

> * The GitHub profiles are listing all the repos you own but they sort them only by age of the
>   latest commit. We prefer to **sort repos** by a combination of how active they are, how much you
>   have contributed to them, how popular they are, etc. For each user we want to see first the latest
>   greatest repos they have most contributed to.
> * On GitHub only repos earn stars. We push it one step further by transferring these **stars to
>   users**. If you have built 23% of a 145 stars repo, you deserve 33 stars for that contribution. We
>   add all these stars and clearly show how many of them you earned in total.
> * The GitHub profiles don't clearly show how big your contribution to a repo was, when you don't own
>   it. Maybe you wrote 5%. Maybe 90%. We **make it clear**.

### :black_square_button: Screenshots to be adapted
