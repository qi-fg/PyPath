"""Check AI response handling without real API requests or credentials."""
import importlib.util
import json
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('pypath_server', Path(__file__).resolve().parents[1] / 'server.py')
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)
config = {'endpoint': 'https://example.invalid/v1', 'model': 'test', 'apiKey': 'test'}
payload = {'question': '这道题的知识点讲一下', 'history': [
    {'role': 'system', 'content': 'ignored'},
    {'role': 'user', 'content': '什么是边界条件？'},
    {'role': 'assistant', 'content': '规则变化的位置。'},
]}

class Response:
    def __init__(self, content):
        self.content = content
    def __enter__(self):
        return self
    def __exit__(self, *args):
        pass
    def read(self):
        return json.dumps({'choices': [{'message': {'content': self.content}}]}).encode()

for content, expected in [('  知识点讲解  ', '知识点讲解'),
                          ([{'type': 'text', 'text': '年龄边界'}, {'type': 'text', 'text': '包含18岁'}], '年龄边界\n包含18岁')]:
    with patch.object(server.urllib.request, 'urlopen', return_value=Response(content)) as request:
        assert server.call_ai(config, payload) == expected
        sent = json.loads(request.call_args.args[0].data)
        assert [x['role'] for x in sent['messages']] == ['system', 'user', 'assistant', 'user']
        assert sent['messages'][1]['content'] == '什么是边界条件？'
        assert '直接解释概念' in sent['messages'][0]['content']
        assert payload['question'] in sent['messages'][-1]['content']
for content in ['', '  ', None, [], [{'type': 'text', 'text': ''}], {'unexpected': 'text'}]:
    with patch.object(server.urllib.request, 'urlopen', return_value=Response(content)):
        try:
            server.call_ai(config, payload)
        except RuntimeError as exc:
            assert '空正文' in str(exc)
        else:
            raise AssertionError('Empty or malformed response accepted')
print('Tutor API checks passed: text blocks, empty responses, teaching instructions and conversation history.')
