// External generic dependencies
import React, {PureComponent} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// External Yoast dependencies
import ContentAnalysis from '@yoast/analysis-report/ContentAnalysis';
import Modal from '@yoast/components/Modal';
import Collapsible from '@yoast/components/Collapsible';
import colors from '@yoast/style-guide/colors';
import {__} from '@wordpress/i18n';

// Internal dependencies
import scoreToRating from 'yoastseo/src/interpreters/scoreToRating';

const modalStyles = {
    content: {
        bottom: 'auto'
    }
};

const StyledContentAnalysisWrapper = styled.div`
    margin: .2rem 1rem;
    font-size: 13px;
`;

class ContentAnalysisWrapper extends PureComponent {
    static propTypes = {
        modalContainer: PropTypes.object.isRequired,
        isAnalyzing: PropTypes.bool.isRequired,
        allResults: PropTypes.object.isRequired,
        seoResults: PropTypes.object.isRequired,
        readabilityResults: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        focusKeyword: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            currentMarkerId: '',
            currentMarker: [],
            modalIsOpen: false
        };
    }

    openModal = () => {
        this.setState({modalIsOpen: true});
    };

    closeModal = () => {
        this.setState({modalIsOpen: false});
    };

    render() {
        const {currentMarker, currentMarkerId, modalIsOpen} = this.state;
        const {allResults, modalContainer, seoResults, readabilityResults} = this.props;

        const seoRating = this.props.seoResults.score ? scoreToRating(this.props.seoResults.score / 10) : 'none';
        const seoRatingIcon = this.props.isAnalyzing ? 'loading-spinner' : 'seo-score-' + seoRating;
        const seoRatingColor = !this.props.isAnalyzing && seoRating !== 'none' ? seoRating : 'grey';

        const readabilityRating = this.props.readabilityResults.score ? scoreToRating(this.props.readabilityResults.score / 10) : 'none';
        const readabilityRatingIcon = this.props.isAnalyzing ? 'loading-spinner' : 'seo-score-' + readabilityRating;
        const readabilityRatingColor = !this.props.isAnalyzing && readabilityRating !== 'none' ? readabilityRating : 'grey';

        return (
            <div className="yoast-seo__content-analysis-wrapper">
                {currentMarkerId && (
                    <Modal isOpen={modalIsOpen} onClose={this.closeModal}
                        modalAriaLabel={allResults[currentMarkerId].text}
                        appElement={modalContainer} style={modalStyles}
                        closeIconButton="Close" heading={__('Analysis results', 'yoast-components')}>
                        <strong
                            dangerouslySetInnerHTML={{__html: allResults[currentMarkerId].text}}/>
                        <ul>
                            {currentMarker.map(mark => (
                                <li key={mark._properties.original} className="yoast-seo__mark"
                                    dangerouslySetInnerHTML={{__html: mark._properties.marked}}/>
                            ))}
                        </ul>
                    </Modal>
                )}

                <Collapsible
                    title={__('Focus keyphrase', 'yoast-components')}
                    prefixIcon={{
                        icon: seoRatingIcon,
                        color: colors['$color_' + seoRatingColor],
                        size: '18px'
                    }}
                    prefixIconCollapsed={{
                        icon: seoRatingIcon,
                        color: colors['$color_' + seoRatingColor],
                        size: '18px'
                    }}
                    headingProps={{level: 2, fontSize: '18px'}}
                >
                    <StyledContentAnalysisWrapper>
                        <ContentAnalysis
                            {...seoResults}
                            onMarkButtonClick={(id, marker) => {
                                this.setState({
                                    currentMarkerId: id,
                                    currentMarker: marker
                                });
                                this.openModal();
                            }}
                            marksButtonStatus={'enabled'}
                        />
                    </StyledContentAnalysisWrapper>
                </Collapsible>

                <Collapsible
                    title={__('Readability analysis', 'yoast-components')}
                    prefixIcon={{
                        icon: readabilityRatingIcon,
                        color: colors['$color_' + readabilityRatingColor],
                        size: '18px'
                    }}
                    prefixIconCollapsed={{
                        icon: readabilityRatingIcon,
                        color: colors['$color_' + readabilityRatingColor],
                        size: '18px'
                    }}
                    headingProps={{level: 2, fontSize: '18px'}}
                >
                    <StyledContentAnalysisWrapper>
                        <ContentAnalysis
                            {...readabilityResults}
                            onMarkButtonClick={(id, marker) => {
                                this.setState({
                                    currentMarkerId: id,
                                    currentMarker: marker
                                });
                                this.openModal();
                            }}
                            marksButtonStatus={'enabled'}
                        />
                    </StyledContentAnalysisWrapper>
                </Collapsible>
            </div>
        );
    }
}

export default ContentAnalysisWrapper;
