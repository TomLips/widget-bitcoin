import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.json.JSONArray;
import org.json.JSONObject;

public class BitcoinIndicators extends JFrame {
    private JPanel mainPanel;
    private JLabel athLabel, btcTodayLabel, forecastLabel;
    private JLabel athPriceLabel, btcPriceLabel, summaryLabel;
    private JLabel updateInfoLabel, disclaimerLabel, viptrendLabel, authorsLabel;
    private JProgressBar athBar, priceBar, forecastBar;
    private Timer updateTimer;
    private SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");

    public BitcoinIndicators() {
        setTitle("Indicadores de Bitcoin y Bitcoin Cash");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(700, 700);
        setLocationRelativeTo(null);

        initComponents();
        setupLayout();
        setupTimer();

        // Cargar datos iniciales
        fetchCryptoData();
    }

    private void initComponents() {
        mainPanel = new JPanel();
        mainPanel.setLayout(new BoxLayout(mainPanel, BoxLayout.Y_AXIS));
        mainPanel.setBackground(new Color(240, 240, 240));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        // Configuración de las barras
        athBar = createBar(Color.GREEN);
        priceBar = createBar(new Color(0, 102, 204)); // Azul para BTC Hoy
        forecastBar = createBar(Color.GREEN);

        // Configuración de las etiquetas
        athLabel = new JLabel("ATH (22 mayo)");
        athLabel.setFont(new Font("Arial", Font.BOLD, 16));
        athLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        btcTodayLabel = new JLabel("BTC Hoy");
        btcTodayLabel.setFont(new Font("Arial", Font.BOLD, 16));
        btcTodayLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        forecastLabel = new JLabel("PREVISIÓN");
        forecastLabel.setFont(new Font("Arial", Font.BOLD, 16));
        forecastLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        athPriceLabel = new JLabel("Máximo Histórico: Cargando...");
        athPriceLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        btcPriceLabel = new JLabel("Precio: Cargando...");
        btcPriceLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel forecastInfoLabel = new JLabel("Según indicador VipTrend-Bitcoin");
        forecastInfoLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        summaryLabel = new JLabel("Cargando resumen...");
        summaryLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        summaryLabel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(221, 221, 221)),
                BorderFactory.createEmptyBorder(12, 12, 12, 12)));
        summaryLabel.setBackground(Color.WHITE);
        summaryLabel.setOpaque(true);

        updateInfoLabel = new JLabel("Cargando información de actualización...");
        updateInfoLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        disclaimerLabel = new JLabel("<html><center>Descargo de Responsabilidad: Esto es un ejemplo educativo y nunca se tomará para trading ni inversiones</center></html>");
        disclaimerLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        disclaimerLabel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(255, 204, 153)),
                BorderFactory.createEmptyBorder(10, 10, 10, 10)));
        disclaimerLabel.setBackground(new Color(255, 243, 230));
        disclaimerLabel.setOpaque(true);
        disclaimerLabel.setForeground(new Color(116, 71, 0));

        viptrendLabel = new JLabel("<html><center><h3>Sobre VipTrend-Bitcoin</h3>Nuestro indicador prevé los posibles movimientos alcistas o bajistas de Bitcoin calculando si se acerca o aleja del actual ATH de Bitcoin</center></html>");
        viptrendLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        viptrendLabel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(Color.DARK_GRAY),
                BorderFactory.createEmptyBorder(10, 10, 10, 10)));
        viptrendLabel.setBackground(Color.BLACK);
        viptrendLabel.setOpaque(true);
        viptrendLabel.setForeground(Color.WHITE);

        authorsLabel = new JLabel("Desarrollado por: Tom Lips & VipTrader");
        authorsLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        authorsLabel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(153, 204, 255)),
                BorderFactory.createEmptyBorder(10, 10, 10, 10)));
        authorsLabel.setBackground(new Color(230, 243, 255));
        authorsLabel.setOpaque(true);
        authorsLabel.setForeground(new Color(0, 77, 153));
    }

    private JProgressBar createBar(Color color) {
        JProgressBar bar = new JProgressBar(SwingConstants.VERTICAL, 0, 100);
        bar.setValue(0);
        bar.setForeground(color);
        bar.setStringPainted(false);
        bar.setPreferredSize(new Dimension(40, 280));
        bar.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 1, 1, 0, new Color(187, 187, 187)),
                BorderFactory.createEmptyBorder(0, 5, 0, 5)));
        return bar;
    }

    private void setupLayout() {
        // Panel para los gráficos
        JPanel chartsPanel = new JPanel();
        chartsPanel.setLayout(new BoxLayout(chartsPanel, BoxLayout.X_AXIS));
        chartsPanel.setAlignmentX(Component.CENTER_ALIGNMENT);
        chartsPanel.setBackground(new Color(240, 240, 240));

        // Gráfico ATH
        JPanel athPanel = createChartPanel(athLabel, athBar, athPriceLabel);
        chartsPanel.add(athPanel);

        // Gráfico BTC Hoy
        JPanel btcPanel = createChartPanel(btcTodayLabel, priceBar, btcPriceLabel);
        chartsPanel.add(btcPanel);

        // Gráfico Previsión
        JPanel forecastPanel = createChartPanel(forecastLabel, forecastBar, new JLabel("Según indicador VipTrend-Bitcoin"));
        chartsPanel.add(forecastPanel);

        mainPanel.add(chartsPanel);
        mainPanel.add(Box.createRigidArea(new Dimension(0, 15)));
        mainPanel.add(summaryLabel);
        mainPanel.add(Box.createRigidArea(new Dimension(0, 10)));
        mainPanel.add(updateInfoLabel);
        mainPanel.add(Box.createRigidArea(new Dimension(0, 10)));
        mainPanel.add(disclaimerLabel);
        mainPanel.add(Box.createRigidArea(new Dimension(0, 10)));
        mainPanel.add(viptrendLabel);
        mainPanel.add(Box.createRigidArea(new Dimension(0, 10)));
        mainPanel.add(authorsLabel);

        add(mainPanel);
    }

    private JPanel createChartPanel(JLabel title, JProgressBar bar, JLabel info) {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
        panel.setBackground(new Color(240, 240, 240));
        panel.setAlignmentX(Component.CENTER_ALIGNMENT);
        panel.setBorder(BorderFactory.createEmptyBorder(0, 5, 0, 5));

        title.setAlignmentX(Component.CENTER_ALIGNMENT);
        panel.add(title);

        JPanel barContainer = new JPanel();
        barContainer.setLayout(new BoxLayout(barContainer, BoxLayout.X_AXIS));
        barContainer.setBackground(new Color(240, 240, 240));

        // Eje Y
        JPanel yAxis = new JPanel();
        yAxis.setLayout(new BoxLayout(yAxis, BoxLayout.Y_AXIS));
        yAxis.setBackground(new Color(240, 240, 240));
        yAxis.setPreferredSize(new Dimension(60, 280));

        String[] yLabels = {"$120,000", "$110,000", "$100,000", "$90,000", "$80,000"};
        for (String label : yLabels) {
            JLabel yLabel = new JLabel(label);
            yLabel.setFont(new Font("Arial", Font.PLAIN, 10));
            yLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
            yAxis.add(yLabel);
            yAxis.add(Box.createRigidArea(new Dimension(0, 45)));
        }

        barContainer.add(yAxis);
        barContainer.add(bar);

        panel.add(barContainer);
        
        info.setAlignmentX(Component.CENTER_ALIGNMENT);
        info.setFont(new Font("Arial", Font.PLAIN, 12));
        panel.add(info);

        return panel;
    }

    private void setupTimer() {
        updateTimer = new Timer(35 * 60 * 1000, new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                fetchCryptoData();
            }
        });
        updateTimer.start();
    }

    private void fetchCryptoData() {
        new Thread(() -> {
            try {
                // Valor fijo para ATH
                final double btcATH = 111814.00;

                // Obtener datos históricos de Bitcoin
                JSONObject btcHistoryData = fetchJsonFromUrl(
                    "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365");
                JSONArray prices = btcHistoryData.getJSONArray("prices");
                double startPrice = prices.getJSONArray(0).getDouble(1);
                double currentPrice = prices.getJSONArray(prices.length() - 1).getDouble(1);
                double btcYTD = ((currentPrice / startPrice) - 1) * 100;

                // Obtener datos actuales de Bitcoin
                JSONObject btcData = fetchJsonFromUrl(
                    "https://api.coingecko.com/api/v3/coins/bitcoin");
                double btcPrice = btcData.getJSONObject("market_data")
                    .getJSONObject("current_price").getDouble("usd");

                // Obtener datos de Bitcoin Cash
                JSONObject bchData = fetchJsonFromUrl(
                    "https://api.coingecko.com/api/v3/coins/bitcoin-cash");
                double bchChange24h = bchData.getJSONObject("market_data")
                    .getDouble("price_change_percentage_24h");

                // Calcular la previsión
                double adjustmentFactor = bchChange24h >= 0 ? 3 : 2;
                double adjustedBchChange = bchChange24h / adjustmentFactor;
                double combinedPrice = btcPrice + (adjustedBchChange / 100 * btcPrice);
                double combinedChange = adjustedBchChange;

                // Escalar las alturas de las barras
                double range = 40000; // $120,000 - $80,000
                int athBarValue = (int) Math.min(((btcATH - 80000) / range) * 100, 100);
                int priceBarValue = (int) Math.min(((btcPrice - 80000) / range) * 100, 100);
                int forecastBarValue = (int) Math.min(((combinedPrice - 80000) / range) * 100, 100);

                // Actualizar UI en el hilo de despacho de eventos
                SwingUtilities.invokeLater(() -> {
                    athBar.setValue(athBarValue);
                    athPriceLabel.setText(String.format("Máximo Histórico: $%.2f", btcATH));

                    priceBar.setValue(priceBarValue);
                    btcPriceLabel.setText(String.format("Precio: $%.2f", btcPrice));

                    forecastBar.setValue(forecastBarValue);
                    forecastBar.setForeground(combinedChange >= 0 ? Color.GREEN : Color.RED);

                    // Generar resumen
                    double priceVsATH = (btcPrice / btcATH) * 100;
                    boolean isNearATH = priceVsATH > 90;
                    boolean isAboveCurrent = forecastBarValue > priceBarValue;

                    String summaryText;
                    if (isNearATH) {
                        if (isAboveCurrent) {
                            summaryText = "El precio de Bitcoin está cerca de su máximo histórico (ATH). La previsión sugiere una tendencia al alza, con posibilidad de superar el ATH en el corto plazo.";
                        } else {
                            summaryText = "El precio de Bitcoin está cerca de su máximo histórico (ATH), pero la previsión indica resistencia, sugiriendo un posible retroceso o consolidación en el precio.";
                        }
                    } else {
                        if (isAboveCurrent) {
                            summaryText = "El precio de Bitcoin está lejos de su máximo histórico (ATH). La previsión muestra una tendencia al alza, indicando un posible acercamiento gradual al ATH.";
                        } else {
                            summaryText = "El precio de Bitcoin está lejos de su máximo histórico (ATH). La previsión sugiere un retroceso adicional en el precio a corto plazo.";
                        }
                    }
                    summaryLabel.setText("<html><div style='width:400px;'>Resumen Comentado: " + summaryText + "</div></html>");

                    // Actualizar información de tiempo
                    Date now = new Date();
                    String lastUpdate = timeFormat.format(now) + " CEST";
                    Date nextUpdate = new Date(now.getTime() + 35 * 60 * 1000);
                    String nextUpdateStr = timeFormat.format(nextUpdate) + " CEST";
                    updateInfoLabel.setText("Actualiza cada 35 minutos | Última actualización: " + lastUpdate + " | Próxima actualización: " + nextUpdateStr);
                });

            } catch (Exception e) {
                SwingUtilities.invokeLater(() -> {
                    athPriceLabel.setText("Máximo Histórico: Error");
                    btcPriceLabel.setText("Precio: Error");
                    summaryLabel.setText("Resumen Comentado: Error al cargar datos - " + e.getMessage());
                    updateInfoLabel.setText("Información de actualización: Error");
                });
                e.printStackTrace();
            }
        }).start();
    }

    private JSONObject fetchJsonFromUrl(String urlString) throws Exception {
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");

        int responseCode = connection.getResponseCode();
        if (responseCode != 200) {
            throw new Exception("Error en la respuesta: " + responseCode);
        }

        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String inputLine;
        StringBuilder response = new StringBuilder();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        return new JSONObject(response.toString());
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            BitcoinIndicators app = new BitcoinIndicators();
            app.setVisible(true);
        });
    }
}
