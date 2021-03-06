let foi = float_of_int;
let iof = int_of_float;

// The core vector type.
type vector<'a> = ('a, 'a)
type t<'a> = vector<'a>

// Vector addition.
let add = (~v1, ~v2) => (fst(v1) + fst(v2), snd(v1) + snd(v2))
let addf = (~v1, ~v2) => (fst(v1) +. fst(v2), snd(v1) +. snd(v2))

// Vector subtraction.
let sub = (~v1, ~v2) => (fst(v1) - fst(v2), snd(v1) - snd(v2))
let subf = (~v1, ~v2) => (fst(v1) -. fst(v2), snd(v1) -. snd(v2))

// Vector multiplication.
let mult = (~v, ~s) => (fst(v) * s, snd(v) * s)
let multf = (~v, ~s) => (fst(v) *. s, snd(v) *. s)

// Vector division.
let div = (~v, ~s) => (fst(v) / s, snd(v) / s)
let divf = (~v, ~s) => (fst(v) /. s, snd(v) /. s)

// Vector magnitude.
let mag = v => {
  let (x, y) = (fst(v) |> foi, snd(v) |> foi)
  sqrt(x ** 2. +. y ** 2.)
}

let magf = v => {
  let (x, y) = v
  sqrt(x ** 2. +. y ** 2.)
}

// Vector normalization.
let norm = v => {
  let m = mag(v)
  switch m {
  | 0. => (0., 0.)
  | _ => divf(~v=(fst(v) |> foi, snd(v) |> foi), ~s=m)
  }
}

let normf = v => {
  let m = magf(v)
  switch m {
  | 0. => (0., 0.)
  | _ => divf(~v, ~s=m)
  }
}

// Vector linear interpolation.
let lerpfV = (~acc, ~target, ~roundness) => {
  let (accX, accY) = acc
  let (targetX, targetY) = target
  let x = Math.lerpf(~acc=accX, ~target=targetX, ~roundness)
  let y = Math.lerpf(~acc=accY, ~target=targetY, ~roundness)
  (x, y)
}

let lerpV = (~acc, ~target, ~roundness) => {
  let (xf, yf) = lerpfV(
    ~acc=(fst(acc) |> foi, snd(acc) |> foi),
    ~target=(fst(target) |> foi, snd(target) |> foi),
    ~roundness,
  )
  (xf |> iof, yf |> iof)
}
