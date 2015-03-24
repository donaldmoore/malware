// Function gets parameters and produce an XML tag
function LPFillOrderXML(Category, ProductName, Quantity, TotalPrice) {
	var xml = "";
	xml = "<item";
	if (Category != null && Category!="") xml += "%20category=\"" + escape(Category) + "\"";
	if (ProductName != null && ProductName!="") xml += "%20name=\"" + escape(ProductName) + "\"";
	if (Quantity != null && Quantity!="") xml += "%20quantity=\"" + escape(Quantity) + "\"";
		if (TotalPrice != null && TotalPrice!="")
			 xml += "%20price=\"" + escape(TotalPrice) + "\"";
	xml += "%20/>";
	return xml;
}
	
