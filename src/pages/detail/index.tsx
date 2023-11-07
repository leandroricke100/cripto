import styles from "./detail.module.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

interface CoinProp {
  symbol: string;
  name: string;
  price: string;
  market_cap: string;
  total_volume_24h: string;
  low_24h: string;
  high_24h: string;
  delta_24h: string | number;
  formatedPrice: string;
  formatedMarket: string;
  formatedLowprice: string;
  formatedHighprice: string;
  numberDelta: number;
  error?: string;
}
export function Detail() {
  const { cripto } = useParams();
  const [detail, setDetail] = useState<CoinProp>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    function getData() {
      fetch(
        `https://sujeitoprogramador.com/api-cripto/coin/?key=2784a65080a70d93&pref=BRL&symbol=${cripto}`
      )
        .then((response) => response.json())
        .then((data: CoinProp) => {
          if (data.error) {
            navigate("/");
          }

          const priceFormatter = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          });

          const formattedData = {
            ...data,
            formatedPrice: priceFormatter.format(Number(data.price)),
            formatedMarket: priceFormatter.format(Number(data.market_cap)),
            formatedLowprice: priceFormatter.format(Number(data.low_24h)),
            formatedHighprice: priceFormatter.format(Number(data.high_24h)),
            numberDelta: parseFloat(data.delta_24h.replace(",", ".")),
          };

          setDetail(formattedData);
          setLoading(false);
        })
        .catch(() => {
          navigate("/");
        });
    }

    getData();
  }, [cripto, navigate]);

  if (loading) {
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando informações...</h4>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{detail?.name}</h1>
      <p className={styles.center}>{detail?.symbol}</p>

      <section className={styles.content}>
        <p>
          <strong>Preço:</strong> {detail?.formatedPrice}
        </p>

        <p>
          <strong>Maior preço 24h:</strong> {detail?.formatedHighprice}
        </p>

        <p>
          <strong>Menor preço 24h:</strong> {detail?.formatedLowprice}
        </p>

        <p>
          <strong>Delta 24h:</strong>
          <span
            className={
              detail?.delta_24h && detail?.numberDelta >= 0
                ? styles.profit
                : styles.loss
            }
          >
            {detail?.delta_24h}
          </span>
        </p>

        <p>
          <strong>Valor mercado:</strong> {detail?.formatedMarket}
        </p>
      </section>

      <Link className={styles.voltar} to="/">
        Voltar
      </Link>
    </div>
  );
}
