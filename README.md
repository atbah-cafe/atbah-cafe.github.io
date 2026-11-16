# منيو عتبة — Atbah Digital Menu

منيو رقمي ثابت (static) لمقهى «عتبة»، مصمم للجوال ويُفتح عن طريق كود QR.

## هيكل الملفات

| الملف | الوظيفة |
|---|---|
| `index.html` | الصفحة الوحيدة للموقع |
| `styles.css` | التصميم والألوان |
| `app.js` | التنقل بين الأقسام والبحث والقائمة الجانبية |
| **`menu.json`** | **كل الأصناف والأسعار. عدّل هنا فقط.** |
| `images/` | الشعار والواجهة والأيقونات وصور المنتجات (WebP) |
| `fonts/` | خط المراعي (Almarai) محمّل مع الموقع |
| `qr-menu.png` | كود QR جاهز لرابط GitHub Pages |
| `.nojekyll` | يخلي GitHub Pages ينشر الملفات زي ما هي |

## تعديل الأسعار والأصناف (`menu.json`)

- **السعر**: رقم مثل `14`، أو نطاق بين علامتي تنصيص مثل `"16–17"`، أو `null` لإخفاء السعر.
- **الحساسية**: الحقل `"allergens"`. احذفه إذا الصنف ما فيه مسببات حساسية.
- **إضافة صنف**: انسخ سطر صنف وعدّل `name` و`nameEn` و`price` و`image`. انتبه للفاصلة `,` بين الأصناف.
- **القسم الفاضي**: إذا كانت `"items": []` يظهر فيه «الأصناف تُضاف قريبًا».
- **صورة جديدة**: ارفعها داخل `images/products/<القسم>/` بصيغة WebP (أو JPG)، واكتب مسارها في `image`.

تقدر تعدّل `menu.json` من موقع GitHub مباشرة: افتح الملف ← أيقونة القلم ✏️ ← عدّل ← **Commit changes**. يتحدث الموقع خلال دقيقة أو دقيقتين.
> للتأكد إن الملف سليم بعد التعديل، الصقه في https://jsonlint.com

## روابط الأقسام (للمشاركة)

`#drip-coffee` · `#espresso` · `#coffee-of-the-day` · `#desserts` · `#extras` · `#gatherings` · `#celebrations` · `#cold-drinks` · `#ice-cream`

مثال: `https://shiii8a-mla.github.io/-/#espresso`

## النشر المجاني على GitHub Pages

1. ادمج الفرع `claude/atbah-cafe-digital-menu-t4cfsz` في `main` (من Pull Request ثم **Merge**).
2. في المستودع افتح **Settings ← Pages**.
3. تحت **Build and deployment** اختر **Source: Deploy from a branch**.
4. اختر الفرع **main** والمجلد **/ (root)** ثم **Save**.
5. انتظر دقيقة أو دقيقتين. يطلع لك الرابط فوق الصفحة، وغالبًا يكون:
   **https://shiii8a-mla.github.io/-/**

> ملاحظة: المستودع خاص؟ GitHub Pages للمستودعات الخاصة يحتاج اشتراك مدفوع. في الحساب المجاني خلّ المستودع عام (Public).
> اسم المستودع `-` يشتغل، بس إذا تبغى رابط أوضح غيّر اسمه من **Settings ← General** (مثلًا `atbah-menu`)، ويصير الرابط `https://shiii8a-mla.github.io/atbah-menu/`. وقتها لازم تسوي كود QR جديد.

### تجربة الموقع على جهازك

الموقع يقرأ `menu.json` بـ fetch، فما يشتغل لو فتحت `index.html` بدبل كليك. شغّل سيرفر بسيط داخل المجلد:

```bash
python3 -m http.server 8000
```

وافتح `http://localhost:8000`.

## كود QR

- **الجاهز**: الملف `qr-menu.png` يودي إلى `https://shiii8a-mla.github.io/-/`. **امسحه بجوالك بعد النشر وتأكد إنه يفتح المنيو** قبل ما تطبعه.
- **لو تغيّر الرابط**، سو كود جديد بأي طريقة من هذي:
  - **Chrome على الكمبيوتر**: افتح الموقع ← زر المشاركة/المزيد بجانب شريط الرابط ← **Create QR code** ← **Download**.
  - **موقع مجاني** مثل https://www.qr-code-generator.com أو https://goqr.me: الصق الرابط واختر **Static QR** (الثابت ما ينتهي)، ونزّله بصيغة **PNG** أو **SVG** للطباعة.
  - **بايثون**:
    ```bash
    pip install qrcode pillow
    python3 -c "import qrcode; qrcode.make('https://YOUR-LINK/').save('qr-menu.png')"
    ```
- **للطباعة**: خلّ الكود بحجم 3×3 سم على الأقل، بلون غامق على خلفية فاتحة، واترك هامش أبيض حوله.
