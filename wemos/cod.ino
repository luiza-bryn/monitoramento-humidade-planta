#include <ESP8266WiFi.h>  // Biblioteca para Wi-Fi no ESP8266
#include <ESP8266HTTPClient.h>  // Biblioteca HTTP para ESP8266

const char* ssid = "LUIZA-5G";
const char* password = "ataldasenha";
const char* serverAddress = "http://ip:8000";  // Endereço do servidor onde está sua API

#define pino_sinal_analogico A0
#define pino_rele 1

int valor_analogico;

void setup() {
    Serial.begin(115200);
    delay(100);

    // Conectar-se à rede Wi-Fi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");

    pinMode(pino_sinal_analogico, INPUT);
    pinMode(pino_rele, OUTPUT);
    digitalWrite(pino_rele, LOW); // seta o pino com nível lógico baixo
}

void loop() {   
    // Coleta via requisição GET a umidade de rega
    int umidade_rega = getUmidadeRega();

    // Le o valor do pino A0 do sensor
    valor_analogico = analogRead(pino_sinal_analogico);
    int umidade = valor_analogico;
    
    // Montar payload JSON
    String payload = "{\"id\":1,\"umidade\":" + String(umidade) + ",\"data\":\"" + getTime() + "\"}";
    
    // Enviar requisição POST
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverAddress + "/logging");
        http.addHeader("Content-Type", "application/json");
        int httpResponseCode = http.POST(payload);

        // Verificar resposta
        if (httpResponseCode > 0) {
            Serial.print("HTTP Response code: ");
            Serial.println(httpResponseCode);
            String response = http.getString();
            Serial.println(response);
        } else {
            Serial.print("Error code: ");
            Serial.println(httpResponseCode);
        }
        http.end();
    } else {
        Serial.println("WiFi Disconnected");
    }
 
    // Mostra o valor da porta analógica no serial monitor
    Serial.print("Porta analógica: ");
    Serial.println(valor_analogico);
 
    // Solo seco, acende led vermelho
    if (valor_analogico > umidade_rega) {
        Serial.println("Status: Solo seco");
        rega();
    }
    delay(5000);
}

void rega() {
  Serial.println("Regando...");
  digitalWrite(pino_rele, HIGH);
  delay(1000);
  digitalWrite(pino_rele, LOW);
}

int getUmidadeRega() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverAddress + "/parametros/1");
        int httpResponseCode = http.GET();

        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.println(response);

            // Parse do JSON para extrair a umidade de rega
            int umidade_rega = parseUmidadeRega(response);
            http.end();
            return umidade_rega;
        } else {
            Serial.print("Error code: ");
            Serial.println(httpResponseCode);
        }
        http.end();
    } else {
        Serial.println("WiFi Disconnected");
    }
    return -1; // Valor de erro
}

int parseUmidadeRega(String response) {
    // Supondo que a resposta JSON tem um formato como {"id":1,"umidade_seco":600,...}
    int startIndex = response.indexOf("\"umidade_seco\":") + 15;
    int endIndex = response.indexOf(",", startIndex);
    String umidade_str = response.substring(startIndex, endIndex);
    return umidade_str.toInt();
}

String getTime() {
    // Função de placeholder para obter a data e hora atual
    // Substitua por sua lógica para obter a data e hora atual
    return "2024-06-30 12:00:00";
}
