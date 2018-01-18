Error.stackTraceLimit = Infinity;

var testContext = require.context('./../../src', true, /\.spec\.ts/);

function requireAll(requireContext) {
  const allContexts = requireContext.keys()

  // list test that can be run (if empty, run them all)
  const runableTests = ['store']

  const runableTestsFiles = runableTests.map(name => "./" + name + ".spec.ts")

  const selectedContexts = runableTestsFiles.length ?
    allContexts.filter(x => runableTestsFiles.findIndex(spec => spec == x) >= 0) : allContexts

  return selectedContexts.map(requireContext);
}

var modules = requireAll(testContext);
