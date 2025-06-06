import { useEffect, useState } from "react";
import axios from "axios";

interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
}

interface Ward {
  code: number;
  name: string;
}

const VietnamAddressSelect = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p")
      .then((res) => setProvinces(res.data));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((res) => {
          setDistricts(res.data.districts || []);
          setWards([]);
        });
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((res) => setWards(res.data.wards || []));
    }
  }, [selectedDistrict]);

  return (
    <div className="space-y-4">
      <div>
        <label>Tỉnh / Thành phố</label>
        <select
          value={selectedProvince ?? ""}
          onChange={(e) => setSelectedProvince(Number(e.target.value))}
          className="border p-2 w-full"
        >
          <option value="">-- Chọn tỉnh --</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Quận / Huyện</label>
        <select
          value={selectedDistrict ?? ""}
          onChange={(e) => setSelectedDistrict(Number(e.target.value))}
          className="border p-2 w-full"
          disabled={!districts.length}
        >
          <option value="">-- Chọn huyện --</option>
          {districts.map((d) => (
            <option key={d.code} value={d.code}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Phường / Xã</label>
        <select className="border p-2 w-full" disabled={!wards.length}>
          <option value="">-- Chọn xã --</option>
          {wards.map((w) => (
            <option key={w.code} value={w.code}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default VietnamAddressSelect;
