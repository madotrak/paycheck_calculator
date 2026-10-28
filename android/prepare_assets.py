"""Copy the site into the Android app and remove website AdSense."""

import re
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
EXPORT = ROOT / "export"
WWW = ROOT / "android" / "app" / "src" / "main" / "assets" / "www"
RES = ROOT / "android" / "app" / "src" / "main" / "res"
ICON = ROOT / "public" / "apple-touch-icon.png"

SCRIPT = re.compile(
    r"\s*<script[^>]+pagead2\.googlesyndication\.com.*?</script>",
    re.IGNORECASE | re.DOTALL,
)
INS = re.compile(
    r"\s*<ins class=\"adsbygoogle\"[\s\S]*?</ins>\s*<script>\s*\(adsbygoogle[\s\S]*?</script>",
    re.IGNORECASE,
)
ASIDE = re.compile(r"\s*<aside class=\"ad\"[\s\S]*?</aside>", re.IGNORECASE)


def main() -> None:
    if WWW.exists():
        shutil.rmtree(WWW)
    shutil.copytree(EXPORT, WWW, ignore=shutil.ignore_patterns("ads.txt"))
    for path in WWW.rglob("*.html"):
        text = path.read_text(encoding="utf-8")
        text = SCRIPT.sub("", text)
        text = INS.sub("", text)
        text = ASIDE.sub("", text)
        path.write_text(text, encoding="utf-8")
    app_js = WWW / "app.js"
    script = app_js.read_text(encoding="utf-8")
    script = script.replace(
        'var ADSENSE_CLIENT = "ca-pub-9069566302664336";',
        'var ADSENSE_CLIENT = "";',
    )
    script = script.replace('var ADSENSE_SLOT = "6638467983";', 'var ADSENSE_SLOT = "";')
    app_js.write_text(script, encoding="utf-8")
    write_icons()


def write_icons() -> None:
    source = Image.open(ICON).convert("RGBA")
    sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }
    for folder, size in sizes.items():
        out = RES / folder
        out.mkdir(parents=True, exist_ok=True)
        image = source.resize((size, size), Image.Resampling.LANCZOS)
        image.save(out / "ic_launcher.png")
        image.save(out / "ic_launcher_round.png")
    play = ROOT / "artifacts" / "android-release"
    play.mkdir(parents=True, exist_ok=True)
    source.resize((512, 512), Image.Resampling.LANCZOS).save(play / "play-store-icon-512.png")


if __name__ == "__main__":
    main()
