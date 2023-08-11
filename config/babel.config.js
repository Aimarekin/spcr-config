module.exports = {
  overrides: [
    {
      test: /\.tsx?$/,
      plugins: [
        ["@babel/plugin-transform-typescript", {
          allowDeclareFields: true,
          disallowAmbiguousJSXLike: true,
          isTSX: true,
          jsxPragma: "Spicetify.React.createElement",
          jsxPragmaFrag: "Spicetify.React.Fragment",
        }],
        ["@babel/preset-env", {
          targets: {
            chrome: "106"
          }
        }]
      ]
    }
  ]
}