import json, tempfile, unittest
from pathlib import Path
from PIL import Image
from build_draft import build, validate
class BuilderTest(unittest.TestCase):
    def spec(self):
        return {'template_name':'Smoke Test','target_length_seconds':3,'scene_count':2,'scenes':[{'scene_number':i+1,'start_time':i*1.5,'end_time':(i+1)*1.5,'duration_seconds':1.5,'text_overlay':'Replace your headline' if i==0 else 'Fixed identity','media_is_editable':True,'text_is_editable':i==0} for i in range(2)]}
    def test_real_draft(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp); Image.new('RGB',(1080,1920),'navy').save(p/'sample.png')
            (p/'spec.json').write_text(json.dumps(self.spec())); (p/'assets.json').write_text(json.dumps({'1':'sample.png','2':'sample.png'}))
            out=build(p/'spec.json',p/'assets.json',p/'drafts')
            data=json.loads((out/'draft_content.json').read_text())
            self.assertEqual(data['duration'],3000000)
            self.assertEqual(len(data['tracks']),2)
            self.assertEqual([len(t['segments']) for t in data['tracks']],[2,2])
            self.assertEqual(data['canvas_config']['width'],1080)
            for media in data['materials']['videos']: self.assertTrue(Path(media['path']).exists())
            review=json.loads((out/'CREATOR_REVIEW.json').read_text()); self.assertFalse(review['scenes'][1]['text_is_editable'])
    def test_invalid(self):
        for field,value in [('start_time',.5),('duration_seconds',float('nan')),('text_is_editable','false')]:
            spec=self.spec(); spec['scenes'][0][field]=value
            with self.assertRaises(ValueError): validate(spec)
    def test_missing_asset_no_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp); (p/'spec.json').write_text(json.dumps(self.spec())); (p/'assets.json').write_text('{}')
            with self.assertRaises(ValueError): build(p/'spec.json',p/'assets.json',p/'drafts')
            self.assertFalse((p/'drafts').exists())
if __name__ == '__main__': unittest.main()
