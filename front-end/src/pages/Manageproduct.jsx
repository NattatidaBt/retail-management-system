import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import api from '../services/api'; 

const categories = ['ทุกหมวดหมู่', 'เครื่องดื่ม', 'ขนมกินเล่น', 'ของใช้', 'อาหารสด', 'ยาและเวชภัณฑ์'];
const categoryMap = { 'เครื่องดื่ม': 1, 'ขนมกินเล่น': 2, 'ของใช้': 3, 'อาหารสด': 4, 'ยาและเวชภัณฑ์': 5 };
const idToCategoryMap = { 1: 'เครื่องดื่ม', 2: 'ขนมกินเล่น', 3: 'ของใช้', 4: 'อาหารสด', 5: 'ยาและเวชภัณฑ์' };

const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-[#D9D9D9] text-gray-700 text-sm outline-none focus:ring-2 focus:ring-amber-700 transition placeholder-gray-400 font-medium';

export default function ManageProduct() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('ทุกหมวดหมู่');
  const [barcode, setBarcode] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [addQty, setAddQty] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('กรัม'); // State สำหรับหน่วยวัด
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ ส่วนที่ 1: แก้ไขการดึงข้อมูลเพื่อให้น้ำหนักแสดงผล (Pre-fill)
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        const p = response.data;
        
        if (p) {
          setProductName(p.name || '');
          setCategory(idToCategoryMap[p.category_id] || 'ทุกหมวดหมู่');
          setBarcode(p.barcode || '');
          setSellPrice(p.price || '');
          setCostPrice(p.cost_price || '');
          setAddQty(p.stock || 0);
          
          // ✅ แก้ไข: ใช้ Regex ดึงเฉพาะตัวเลขและจุดทศนิยมออกมา (เช่น "430 มล." -> "430")
          if (p.weight_g) {
            const numericMatch = p.weight_g.match(/[\d.]+/); 
            const numericValue = numericMatch ? numericMatch[0] : '';
            setWeight(numericValue); // ใส่ค่าตัวเลขลงในช่อง Input

            // ตรวจสอบหน่วยวัดจากข้อความเดิมใน DB เพื่อตั้งค่า Dropdown ให้ตรงกัน
            if (p.weight_g.includes('มล')) {
              setUnit('มล.');
            } else if (p.weight_g.includes('ก.')) {
              setUnit('ก.');
            } else {
              setUnit('กรัม');
            }
          }

          if (p.image_url) setImage(p.image_url);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        alert('ไม่สามารถโหลดข้อมูลสินค้าเก่าได้');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      alert('เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถจัดการสินค้าได้');
      navigate('/products');
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (image && typeof image === 'string' && image.startsWith('blob:')) URL.revokeObjectURL(image);
      setImage(URL.createObjectURL(file));
    }
  };

  // ✅ ส่วนที่ 2: รวมตัวเลขและหน่วยเข้าด้วยกันก่อนบันทึก
  const handleSave = async () => {
    if (!productName.trim()) { alert('กรุณากรอกชื่อสินค้า'); return; }
    if (category === 'ทุกหมวดหมู่') { alert('กรุณาเลือกหมวดหมู่สินค้า'); return; }
    if (!sellPrice || Number(sellPrice) <= 0) { alert('กรุณากรอกราคาขายที่ถูกต้อง'); return; }

    try {
      setLoading(true);
      const productData = {
        name: productName.trim(),
        category_id: categoryMap[category],
        price: Number(sellPrice),
        cost_price: costPrice ? Number(costPrice) : 0,
        stock: Number(addQty) || 0,
        barcode: barcode.trim() || null,
        // รวมร่างค่าตัวเลขกับหน่วยเป็นข้อความเดียว (เช่น "430" + " " + "มล.")
        weight_g: weight ? `${weight} ${unit}` : null 
      };

      if (id) {
        await api.put(`/products/${id}`, productData);
        alert(`แก้ไขสินค้า "${productName}" เรียบร้อยแล้ว`);
      } else {
        await api.post('/products', productData);
        alert(`เพิ่มสินค้าใหม่ "${productName}" สำเร็จ`);
      }
      navigate('/products');
    } catch (err) {
      alert(err.response?.data?.message || 'บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (image && typeof image === 'string' && image.startsWith('blob:')) URL.revokeObjectURL(image);
    navigate('/products');
  };

  return (
  <div className="flex flex-col h-full bg-[#f4f4f4] p-8 overflow-y-auto">
    <div className="max-w-5xl mx-auto bg-white border-2 border-[#8B5A2B] rounded-[24px] p-8 shadow-sm w-full">

      <h2 className="text-xl font-black text-amber-900 mb-6">
        {id ? 'แก้ไขข้อมูลสินค้า' : 'จัดการข้อมูลสินค้า'}
      </h2>

      
      <div className="grid grid-cols-[220px_1fr] gap-8 mb-6">

        {/* รูปภาพสินค้า */}
        <div className="flex flex-col gap-3">
          <label className="block text-base font-bold text-black">รูปภาพสินค้า</label>
          <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-[#D9D9D9] flex items-center justify-center overflow-hidden">
            {image ? (
              <img src={image} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">ยังไม่มีรูปภาพ</span>
              </div>
            )}
          </div>
          <label className="cursor-pointer px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-white text-sm font-bold rounded-xl transition text-center">
            เลือกรูปภาพ
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        {/* ข้อมูลสินค้า */}
        <div className="flex flex-col gap-5">

          {/* ชื่อสินค้า */}
          <div>
            <label className="block text-base font-bold text-black mb-2">ชื่อสินค้า</label>
            <input
              type="text"
              className={inputClass}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="กรอกชื่อสินค้า"
            />
          </div>

          {/* หมวดหมู่ */}
          <div>
            <label className="block text-base font-bold text-black mb-2">หมวดหมู่</label>
            <select
              className={`${inputClass} cursor-pointer`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>

          {/* บาร์โค้ด */}
          <div>
            <label className="block text-base font-bold text-black mb-2">บาร์โค้ด</label>
            <input
              type="text"
              className={inputClass}
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="กรอกบาร์โค้ด"
            />
          </div>

          {/* ราคาขาย / ราคาต้นทุน */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-base font-bold text-black mb-2">ราคาขาย</label>
              <input
                type="number"
                className={inputClass}
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="flex-1">
              <label className="block text-base font-bold text-black mb-2">ราคาต้นทุน</label>
              <input
                type="number"
                className={inputClass}
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* น้ำหนักสินค้า */}
          <div>
            <label className="block text-base font-bold text-black mb-2">น้ำหนักสินค้า</label>
            <div className="flex gap-3">
              <input
                type="number"
                step="0.01"
                className={`${inputClass} flex-1`}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.00"
              />
              <select
                className="w-32 px-4 py-2.5 rounded-xl bg-[#D9D9D9] text-gray-700 text-sm outline-none focus:ring-2 focus:ring-amber-700 font-bold cursor-pointer transition-all"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="กรัม">กรัม</option>
                <option value="มล.">มล.</option>
                <option value="ก.">ก.</option>
              </select>
            </div>
          </div>

          {/* จำนวนสต็อก */}
          <div className="w-1/2">
            <label className="block text-base font-bold text-black mb-2">
              {id ? 'จำนวนคงเหลือปัจจุบัน' : 'จำนวนสินค้าเริ่มต้น'}
            </label>
            <input
              type="number"
              className={inputClass}
              value={addQty}
              onChange={(e) => setAddQty(e.target.value)}
              disabled={!!id}
            />
            {id && (
              <p className="text-[10px] text-amber-600 mt-1 font-bold">
                * แก้ไขสต็อกได้ที่เมนู "จัดการสต็อกสินค้า"
              </p>
            )}
          </div>

        </div>
        

      </div>
      

      {/* ปุ่มดำเนินการ */}
      <div className="flex justify-end items-center gap-4 border-t pt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="font-bold text-base text-black hover:text-amber-700 transition"
        >
          {loading ? 'กำลังบันทึก...' : id ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'}
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={handleCancel}
          className="text-black font-bold text-base hover:text-red-600 transition"
        >
          ยกเลิก
        </button>
      </div>

    </div>
  </div>
  );
}