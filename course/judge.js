// Shared by the app and release validation so they execute identical checks.
(() => {
  function buildCaseCode(code, test = {}) {
    const payload = JSON.stringify({ code, overrides: test.overrides || {}, checks: test.checkCode || '', append: test.appendCode || '', moduleName: test.moduleName || '__main__' });
    return `import ast as _pa, json as _pj, sys as _ps, types as _pt, os as _po
_pd = _pj.loads(${JSON.stringify(payload)})
_tree = _pa.parse(_pd['code'], filename='<exercise>')
_pending = dict(_pd['overrides'])
for _node in _tree.body:
    _targets = _node.targets if isinstance(_node, _pa.Assign) else ([_node.target] if isinstance(_node, _pa.AnnAssign) else [])
    for _target in _targets:
        _name = _pa.unparse(_target)
        if _name in _pending:
            _node.value = _pa.parse(_pending.pop(_name), mode='eval').body
if _pending:
    raise AssertionError('请保留题目给定的输入变量：' + ', '.join(_pending))
_pa.fix_missing_locations(_tree)
_module = _pt.ModuleType(_pd['moduleName'])
_namespace = _module.__dict__
_namespace['__file__'] = '<exercise>'
_namespace['__pypath_ast'] = _pa.parse(_pd['code'])
_namespace['__pypath_nodes'] = lambda kind: [n for n in _pa.walk(_namespace['__pypath_ast']) if type(n).__name__ == kind]
_namespace['__pypath_calls'] = lambda: [(_pa.unparse(n.func), n) for n in _pa.walk(_namespace['__pypath_ast']) if isinstance(n, _pa.Call)]
_old_module = _ps.modules.get(_pd['moduleName'])
_old_argv = list(_ps.argv)
_old_environ = dict(_po.environ)
_ps.modules[_pd['moduleName']] = _module
try:
    exec(compile(_tree, '<exercise>', 'exec'), _namespace, _namespace)
    if _pd['append']:
        exec(compile(_pd['append'], '<hidden-test>', 'exec'), _namespace, _namespace)
    if _pd['checks']:
        exec(compile(_pd['checks'], '<behaviour-check>', 'exec'), _namespace, _namespace)
finally:
    _ps.argv[:] = _old_argv
    _po.environ.clear()
    _po.environ.update(_old_environ)
    if _old_module is None:
        _ps.modules.pop(_pd['moduleName'], None)
    else:
        _ps.modules[_pd['moduleName']] = _old_module
`;
  }
  window.PyPathJudge = { buildCaseCode };
})();
