$cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "Cert:\CurrentUser\My" -FriendlyName "Finances Dev" -NotAfter (Get-Date).AddYears(1) -KeyUsage DigitalSignature,KeyEncipherment -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1")
$thumb = $cert.Thumbprint
Write-Output $thumb
