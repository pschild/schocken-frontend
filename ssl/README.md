# 1. Generiere Private Key und Zertifikat
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout localhost.key \
  -out localhost.crt \
  -config localhost.conf \
  -extensions v3_req

# 2. Verifiziere das Zertifikat
openssl x509 -in localhost.crt -text -noout | grep -A 1 "Subject Alternative Name"

# 3. Chrome manuell konfigurieren
* Chrome öffnen: chrome://settings/certificates
* Tab "Authorities" (Zertifizierungsstellen)
* "Import" → localhost.crt auswählen
* ✓ "Trust this certificate for identifying websites"
* Chrome komplett neu starten (alle Fenster schließen!)
