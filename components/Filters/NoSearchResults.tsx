import css from '@/components/Filters/NoSearchResults.module.css'
type NoSearchResultsProps = {
  onReset: () => void;
};
export const NoSearchResults = ({onReset}: NoSearchResultsProps) => {
    
    return (
        <div className={`${css.wrapperOne} container`}>
            <div className={css.wrapper}>
            <h1 className={css.text}>We’re sorry! We were not able to find a match.</h1>
            <button onClick={onReset} className={css.button}>Reset search and filters</button>
        </div>
        </div>
    )
}