open Jest

let it = test

describe("Parse_transform", () => {
  describe("testTransform", () => {
    testAll(
      "should test a raw string to verify it's a valid CSS transform",
      list{
        "translateX(5px)",
        "skew(20deg, 5rad)",
        "translate(10px, 10px)",
        "rotate(20deg)",
        "scale(0.5, 1.5)",
      },
      transform => {
        open Expect
        expect(Parse_transform.testTransform(transform)) |> toBe(true)
      },
    )

    testAll(
      "should flag strings that are not valid transforms",
      list{"translate(2px", "flatten(5rem)", "yep", "skew(2deg, 2rad", "rotate"},
      transform => {
        open Expect
        expect(Parse_transform.testTransform(transform)) |> toBe(false)
      },
    )
  })

  describe("testTransforms", () => {
    testAll(
      "should test a raw string to verify it's a valid CSS transform",
      list{
        "translateX(5px)",
        "skew(20deg, 5rad)",
        "translate(10px, 10px) rotate(20deg)",
        "scale(0.5, 1.5) translateY(5px) translateZ(10px)",
      },
      transform => {
        open Expect
        expect(Parse_transform.testTransforms(transform)) |> toBe(true)
      },
    )

    testAll(
      "should flag strings that aren't valid CSS transforms",
      list{"translateX(5px", "skew(20deg, 5rad", "transition(10px, 10px)blah(20deg)"},
      transform => {
        open Expect
        expect(Parse_transform.testTransforms(transform)) |> toBe(false)
      },
    )
  })

  describe("parseTransform", () => {
    it("should parse a transform into its transform property and value", () => {
      open Expect
      expect(Parse_transform.parseTransform("translateX(20px)")) |> toEqual({
        open Parse_transform
        {
          transformProperty: Js.Nullable.return("translateX"),
          transform: Js.Nullable.return("20px"),
        }
      })
    })

    it("should handle translate, scale, rotate, skew, and perspective in one dimensions", () => {
      let translate = Parse_transform.parseTransform("translateY(20px)")
      let scale = Parse_transform.parseTransform("scaleZ(0.5)")
      let rotate = Parse_transform.parseTransform("rotateX(0.5turn)")
      let skew = Parse_transform.parseTransform("skewZ(1.5rad)")
      let perspective = Parse_transform.parseTransform("perspective(10px)")

      open Expect
      expect((translate, scale, rotate, skew, perspective)) |> toEqual((
        {
          open Parse_transform
          {
            transformProperty: Js.Nullable.return("translateY"),
            transform: Js.Nullable.return("20px"),
          }
        },
        {
          open Parse_transform
          {
            transformProperty: Js.Nullable.return("scaleZ"),
            transform: Js.Nullable.return("0.5"),
          }
        },
        {
          open Parse_transform
          {
            transformProperty: Js.Nullable.return("rotateX"),
            transform: Js.Nullable.return("0.5turn"),
          }
        },
        {
          open Parse_transform
          {
            transformProperty: Js.Nullable.return("skewZ"),
            transform: Js.Nullable.return("1.5rad"),
          }
        },
        {
          open Parse_transform
          {
            transformProperty: Js.Nullable.return("perspective"),
            transform: Js.Nullable.return("10px"),
          }
        },
      ))
    })

    it("should return the raw string if a value lacks an opening parenthesis", () => {
      open Expect
      expect(Parse_transform.parseTransform("scale1.2)")) |> toEqual({
        open Parse_transform
        {
          transformProperty: Js.Nullable.null,
          transform: Js.Nullable.null,
        }
      })
    })

    it("should return the raw string if a value lacks a closing parenthesis", () => {
      open Expect
      expect(Parse_transform.parseTransform("scale(1.2")) |> toEqual({
        open Parse_transform
        {
          transformProperty: Js.Nullable.null,
          transform: Js.Nullable.null,
        }
      })
    })

    it("should handle multiple values inside a transform property", () => {
      open Expect
      expect(Parse_transform.parseTransform("translate(20px, 50px)")) |> toEqual({
        open Parse_transform
        {
          transformProperty: Js.Nullable.return("translate"),
          transform: Js.Nullable.return("20px, 50px"),
        }
      })
    })
  })

  describe("parseTransforms", () =>
    it("should split a string with multiple transforms into its individual transforms", () => {
      open Expect
      expect(Parse_transform.parseTransforms("translate(2px, 5px) scale(1.4)")) |> toEqual([
        "translate(2px, 5px)",
        "scale(1.4)",
      ])
    })
  )
})
